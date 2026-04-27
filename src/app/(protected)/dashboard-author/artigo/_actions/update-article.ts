'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { z } from 'zod'
import { checkPermission } from '@/lib/permissions/check-permission'
import { prisma } from '@/lib/prisma'

const articleSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(200),
  subtitle: z.string().optional(),
  content: z.string().min(50, 'O conteúdo deve ser mais longo'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  coverImage: z.string().optional(),
  coverImageCredit: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

export async function updateArticleAction(
  id: string,
  data: z.infer<typeof articleSchema>,
) {
  try {
    // 1. Verificação de Permissão via RBAC
    const permission = await checkPermission('update', 'articles')
    if (!permission.allowed) {
      return { success: false, error: permission.error || 'Não autorizado' }
    }

    const validated = articleSchema.parse(data)

    // 2. Busca o artigo e valida propriedade
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true, title: true, slug: true, organizationId: true },
    })

    if (!existingArticle)
      return { success: false, error: 'Artigo não encontrado.' }

    // Garante que autores só editam seus próprios artigos (Bypass para OWNER/ADMIN/EDITOR já está no checkPermission)
    if (
      permission.role === 'AUTHOR' &&
      existingArticle.authorId !== permission.userId
    ) {
      return {
        success: false,
        error: 'Você não tem permissão para editar este artigo.',
      }
    }

    const organizationId = existingArticle.organizationId
    let newSlug = existingArticle.slug
    if (validated.title !== existingArticle.title) {
      const baseSlug = slugify(validated.title, { lower: true, strict: true })
      newSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`
    }

    // Limpa tags antigas e atualiza artigo
    await prisma.articleTag.deleteMany({ where: { articleId: id } })

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: validated.title,
        subtitle: validated.subtitle || null,
        content: validated.content,
        slug: newSlug,
        coverImage: validated.coverImage || null,
        coverImageCredit: validated.coverImageCredit || null,
        status: validated.status,
        categoryId: validated.categoryId,
        publishedAt: validated.status === 'published' ? new Date() : undefined,
        tags: {
          create: validated.tags?.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: {
                  slug: slugify(tagName, { lower: true, strict: true }),
                },
                create: {
                  name: tagName,
                  slug: slugify(tagName, { lower: true, strict: true }),
                  organizationId: organizationId,
                },
              },
            },
          })),
        },
      },
    })

    revalidatePath('/')
    revalidatePath('/dashboard-author')
    revalidatePath('/dashboard-author/artigo')
    revalidatePath(`/artigo/${article.slug}`)

    return { success: true, slug: article.slug, id: article.id }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('Erro ao atualizar artigo:', error)
    return {
      success: false,
      error: 'Falha interna ao processar a atualização.',
    }
  }
}
