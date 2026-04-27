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

export async function createArticleAction(data: z.infer<typeof articleSchema>) {
  try {
    // 1. Verificação de Permissão Robusta via RBAC
    const permission = await checkPermission('create', 'articles')
    if (!permission.allowed) {
      return { success: false, error: permission.error || 'Não autorizado' }
    }

    const userId = permission.userId!
    const validated = articleSchema.parse(data)

    // Busca organização vinculada ao membro
    const member = await prisma.member.findFirst({
      where: { userId },
    })

    if (!member) {
      return {
        success: false,
        error: 'Membro não vinculado a uma organização.',
      }
    }

    const organizationId = member.organizationId
    const baseSlug = slugify(validated.title, { lower: true, strict: true })
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

    const article = await prisma.article.create({
      data: {
        title: validated.title,
        subtitle: validated.subtitle || null,
        content: validated.content,
        slug: uniqueSlug,
        coverImage: validated.coverImage || null,
        coverImageCredit: validated.coverImageCredit || null,
        status: validated.status,
        categoryId: validated.categoryId,
        authorId: userId,
        organizationId: organizationId,
        publishedAt: validated.status === 'published' ? new Date() : null,
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

    return { success: true, slug: article.slug, id: article.id }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('Erro ao criar artigo:', error)
    return {
      success: false,
      error: 'Falha interna ao processar a requisição.',
    }
  }
}
