import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'

/**
 * Busca um artigo pelo slug com autor, categoria e tags.
 */
export const getArticleBySlug = async (slug: string) => {
  try {
    const article = await prisma.article.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
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