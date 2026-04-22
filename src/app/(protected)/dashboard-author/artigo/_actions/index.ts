'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import slugify from 'slugify'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const articleSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(200),
  subtitle: z.string().optional(),
  content: z.string().min(50, 'O conteúdo deve ser mais longo'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})

export async function createArticleAction(data: z.infer<typeof articleSchema>) {
  console.log("🚀 [SERVER] Iniciando createArticleAction...");
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      console.error("❌ [SERVER] Nenhuma sessão encontrada no getSession.");
      return { success: false, error: 'Sessão expirada ou não encontrada. Faça login novamente.' }
    }

    const userId = session.user.id;

    // 1. Validar Dados
    const validated = articleSchema.parse(data)

    // 2. Garantir que o usuário seja membro de uma organização
    let member = await prisma.member.findFirst({
      where: { userId },
    })

    if (!member) {
      const firstOrg = await prisma.organization.findFirst();
      if (!firstOrg) {
         return { success: false, error: "Nenhuma organização configurada." };
      }
      member = await prisma.member.create({
        data: { userId, organizationId: firstOrg.id, role: "AUTHOR" }
      });
    }

    const organizationId = member.organizationId;

    // 3. Gerar Slug Único
    const baseSlug = slugify(validated.title, { lower: true, strict: true })
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

    // 4. Criar Artigo
    const article = await prisma.article.create({
      data: {
        title: validated.title,
        subtitle: validated.subtitle || null,
        content: validated.content,
        slug: uniqueSlug,
        coverImage: validated.coverImage || null,
        status: validated.status,
        categoryId: validated.categoryId,
        authorId: userId,
        organizationId: organizationId,
        publishedAt: validated.status === 'published' ? new Date() : null,

        tags: {
          create: validated.tags?.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { slug: slugify(tagName, { lower: true, strict: true }) },
                create: { 
                  name: tagName, 
                  slug: slugify(tagName, { lower: true, strict: true }),
                  organizationId: organizationId
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
    return { success: false, error: error.message || 'Falha ao salvar no banco.' }
  }
}

export async function updateArticleAction(id: string, data: z.infer<typeof articleSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    const validated = articleSchema.parse(data)
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true, title: true, slug: true, organizationId: true }
    });

    if (!existingArticle) return { success: false, error: "Artigo não encontrado." };

    const organizationId = existingArticle.organizationId;
    let newSlug = existingArticle.slug;
    if (validated.title !== existingArticle.title) {
       const baseSlug = slugify(validated.title, { lower: true, strict: true });
       newSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    await prisma.articleTag.deleteMany({ where: { articleId: id } });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: validated.title,
        subtitle: validated.subtitle || null,
        content: validated.content,
        slug: newSlug,
        coverImage: validated.coverImage || null,
        status: validated.status,
        categoryId: validated.categoryId,
        publishedAt: validated.status === 'published' && !existingArticle.slug.includes('published') ? new Date() : undefined,
        tags: {
          create: validated.tags?.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { slug: slugify(tagName, { lower: true, strict: true }) },
                create: { 
                  name: tagName, 
                  slug: slugify(tagName, { lower: true, strict: true }),
                  organizationId: organizationId
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
    return { success: false, error: error.message || 'Falha ao atualizar no banco.' }
  }
}
