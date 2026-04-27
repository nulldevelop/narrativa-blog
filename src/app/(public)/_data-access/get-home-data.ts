import { unstable_cache } from 'next/cache'
import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'
import { getAllTags } from './get-all-tags'

/**
 * Busca os dados para a home: artigos em destaque e listagem geral em poucas queries.
 * Corrigido problema N+1 ao buscar tags de destaque individualmente.
 */
export const getHomeData = async (
  currentPage: number,
  postsPerPage: number,
  category?: string,
  tag?: string,
) => {
  return unstable_cache(
    async () => {
      try {
        const systemTags = [
          'home-principal',
          'home-destaque-1',
          'home-destaque-2',
          'home-destaque-3',
          'home-geral-1',
          'home-geral-2',
          'home-listagem',
        ]

        // 1. Busca artigos de destaque e tags permitidas de forma SEQUENCIAL
        // Isso evita pedir 2 conexões ao mesmo tempo, o que causa o pool timeout em bancos limitados.
        const featuredArticlesRaw = await prisma.article.findMany({
          where: {
            status: 'published',
            tags: { some: { tag: { slug: { in: systemTags } } } },
          },
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
          orderBy: { publishedAt: 'desc' },
        })

        const allTags = await getAllTags()

        // 2. Mapeamento em memória para evitar múltiplas queries
        const findByTag = (slug: string) =>
          featuredArticlesRaw.find((a) =>
            a.tags.some((t) => t.tag.slug === slug),
          ) as unknown as ArticleHero | undefined

        const mainFeaturedArticle = findByTag('home-principal') || null
        const secondaryHero = [
          findByTag('home-destaque-1'),
          findByTag('home-destaque-2'),
          findByTag('home-destaque-3'),
        ].filter(Boolean) as ArticleHero[]

        const generalFeatured = [
          findByTag('home-geral-1'),
          findByTag('home-geral-2'),
        ].filter(Boolean) as ArticleHero[]

        // CORREÇÃO: Excluir apenas os IDs que estão REALMENTE ocupando os slots de destaque
        const displayedIds = [
          mainFeaturedArticle?.id,
          ...secondaryHero.map((a) => a.id),
          ...generalFeatured.map((a) => a.id),
        ].filter(Boolean) as string[]

        const isFiltering = !!(category || tag)

        // Construção robusta da query
        const whereClause: any = {
          status: 'published',
        }

        if (!isFiltering) {
          whereClause.id = { notIn: displayedIds }
        } else {
          if (category) {
            whereClause.category = { slug: category }
          }
          if (tag) {
            whereClause.tags = { some: { tag: { slug: tag } } }
          }
        }

        const articles = await prisma.article.findMany({
          where: whereClause,
          take: postsPerPage,
          skip: (currentPage - 1) * postsPerPage,
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
        })

        const totalArticles = await prisma.article.count({ where: whereClause })

        return {
          mainFeaturedArticle,
          secondaryHero,
          generalFeatured,
          articles,
          totalPages: Math.ceil(totalArticles / postsPerPage),
          allTags,
        }
      } catch (error) {
        console.error('Error getting home data:', error)
        return {
          mainFeaturedArticle: null,
          secondaryHero: [],
          generalFeatured: [],
          articles: [],
          totalPages: 0,
          allTags: [],
        }
      }
    },
    [
      'home-data',
      currentPage.toString(),
      postsPerPage.toString(),
      category || 'all',
      tag || 'all',
    ],
    {
      revalidate: 60, // Cache de 60 segundos para evitar sobrecarga no banco
      tags: ['articles', 'tags'],
    },
  )()
}
