import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'
import { fetchByTag } from './fetch-by-tag'
import { getAllTags } from './get-all-tags'

/**
 * Busca os dados para a home: artigos em destaque (via tags) e listagem geral paginada.
 */
export const getHomeData = async (
  currentPage: number,
  postsPerPage: number,
  category?: string,
  tag?: string,
) => {
  try {
    const [mainFeaturedArticle, d1, d2, d3, dGeral1, dGeral2, allTags] =
      await Promise.all([
      fetchByTag('home-principal'),
      fetchByTag('home-destaque-1'),
      fetchByTag('home-destaque-2'),
      fetchByTag('home-destaque-3'),
      fetchByTag('home-geral-1'),
      fetchByTag('home-geral-2'),
      getAllTags(),
    ])

  const secondaryHero = [d1, d2, d3].filter(Boolean) as ArticleHero[]
  const generalFeatured = [dGeral1, dGeral2].filter(Boolean) as ArticleHero[]

  const featuredIds = new Set(
    [
      mainFeaturedArticle?.id,
      ...secondaryHero.map((a) => a.id),
      ...generalFeatured.map((a) => a.id),
    ].filter((id): id is string => !!id),
  )

  const isFiltering = !!(category || tag)

  const whereClause = {
    status: 'published',
    ...(!isFiltering ? { id: { notIn: Array.from(featuredIds) } } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
  }

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: whereClause,
      take: postsPerPage,
      skip: (currentPage - 1) * postsPerPage,
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    }),
    prisma.article.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(totalArticles / postsPerPage)

  return {
      mainFeaturedArticle,
      secondaryHero,
      generalFeatured,
      articles,
      totalPages,
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
}