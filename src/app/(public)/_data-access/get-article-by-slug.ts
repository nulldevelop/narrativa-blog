import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

/**
 * Busca um artigo pelo slug com autor, categoria e tags.
 * Corrigido: Removido o incremento de views automático para evitar side-effects
 * e permitir cache (ISR/SSG).
 */
export const getArticleBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
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
    },
    ['get-article-by-slug', slug],
    {
      revalidate: 3600, // 1 hora
      tags: ['articles'],
    }
  )()
}
