import { unstable_cache } from 'next/cache'
import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'

/**
 * Busca o último artigo publicado de uma categoria específica.
 */
export const fetchByCategory = async (
  categorySlug: string,
): Promise<ArticleHero | null> => {
  return unstable_cache(
    async () => {
      try {
        return (await prisma.article.findFirst({
          where: {
            status: 'published',
            category: { slug: categorySlug },
          },
          orderBy: { publishedAt: 'desc' },
          include: { category: true },
        })) as ArticleHero | null
      } catch (error) {
        console.error('Error fetching by category:', error)
        return null
      }
    },
    ['fetch-by-category', categorySlug],
    {
      revalidate: 3600, // 1 hora
      tags: ['articles', 'categories'],
    }
  )()
}

/**
 * Busca todos os artigos publicados de uma categoria específica.
 */
export const fetchAllByCategory = async (
  categorySlug: string,
): Promise<ArticleHero[]> => {
  return unstable_cache(
    async () => {
      try {
        return (await prisma.article.findMany({
          where: {
            status: 'published',
            category: { slug: categorySlug },
          },
          orderBy: { publishedAt: 'desc' },
          include: { 
            category: true,
            tags: { include: { tag: true } }
          },
        })) as unknown as ArticleHero[]
      } catch (error) {
        console.error('Error fetching all by category:', error)
        return []
      }
    },
    ['fetch-all-by-category', categorySlug],
    {
      revalidate: 3600, // 1 hora
      tags: ['articles', 'categories'],
    }
  )()
}
