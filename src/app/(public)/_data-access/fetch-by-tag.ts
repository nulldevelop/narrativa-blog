import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'

/**
 * Busca o primeiro artigo publicado que possua uma tag específica.
 */
export const fetchByTag = async (tagSlug: string): Promise<ArticleHero | null> => {
  try {
    return (await prisma.article.findFirst({
      where: {
        status: 'published',
        tags: { some: { tag: { slug: tagSlug } } },
      },
      include: { category: true },
    })) as ArticleHero | null
  } catch (error) {
    console.error('Error fetching by tag:', error)
    return null
  }
}