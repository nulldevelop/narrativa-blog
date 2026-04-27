import { unstable_cache } from 'next/cache'
import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'

/**
 * Busca o primeiro artigo publicado que possua uma tag específica.
 */
export const fetchByTag = async (
  tagSlug: string,
): Promise<ArticleHero | null> => {
  return unstable_cache(
    async () => {
      try {
        return (await prisma.article.findFirst({
          where: {
            status: 'published',
            tags: { some: { tag: { slug: tagSlug } } },
          },
          orderBy: { publishedAt: 'desc' },
          include: {
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        })) as ArticleHero | null
      } catch (error) {
        console.error('Error fetching by tag:', error)
        return null
      }
    },
    ['fetch-by-tag', tagSlug],
    {
      revalidate: 3600, // 1 hora
      tags: ['articles', 'tags'],
    },
  )()
}
