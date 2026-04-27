import { prisma } from '@/lib/prisma'

/**
 * Busca um artigo pelo slug com autor, categoria e tags.
 * Corrigido: Removido o incremento de views automático para evitar side-effects
 * e permitir cache (ISR/SSG).
 */
export const getArticleBySlug = async (slug: string) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    })
    return article
  } catch (error) {
    console.error('Error getting article by slug:', error)
    return null
  }
}
