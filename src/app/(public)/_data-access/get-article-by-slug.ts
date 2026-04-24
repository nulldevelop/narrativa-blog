import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'

/**
 * Busca um artigo pelo slug com autor, categoria e tags.
 */
export const getArticleBySlug = async (slug: string) => {
  try {
    return await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    })
  } catch (error) {
    console.error('Error getting article by slug:', error)
    return null
  }
}