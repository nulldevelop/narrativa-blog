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
  try {
    const systemTags = [
      'home-principal',
      'home-destaque-1',
      'home-destaque-2',
      'home-destaque-3',
      'home-geral-1',
      'home-geral-2',
    ]

    // 1. Busca artigos de destaque e tags permitidas em paralelo
    const [featuredArticlesRaw, allTags] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'published',
          tags: { some: { tag: { slug: { in: systemTags } } } },
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      getAllTags(),
    ])

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

    const featuredIds = new Set(featuredArticlesRaw.map((a) => a.id))
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
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.article.count({ where: whereClause }),
    ])

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
}
