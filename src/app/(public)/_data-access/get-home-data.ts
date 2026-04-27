import { unstable_cache } from 'next/cache'
import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'
import { getAllTags } from './get-all-tags'

/**
 * Busca os dados para a home: artigos em destaque e listagem geral em poucas queries.
 * Corrigido problema N+1 ao buscar tags de destaque individualmente.
 */
interface HomeData {
  mainFeaturedArticle: ArticleHero | null
  secondaryHero: ArticleHero[]
  generalFeatured: ArticleHero[]
  articles: any[]
  bastidoresArticles: any[]
  totalPages: number
  allTags: any[]
}

export const getHomeData = async (
  currentPage: number,
  postsPerPage: number,
  category?: string,
  tag?: string,
): Promise<HomeData> => {
  const fetchWithRetry = async (retries = 3): Promise<HomeData> => {
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

      // Busca artigos da categoria 'bastidores'
      const bastidoresArticles = await prisma.article.findMany({
        where: {
          status: 'published',
          category: { slug: 'bastidores' },
        },
        take: 3, // Limitando a 3 para a seção da home
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      })

      const displayedIds = [
        mainFeaturedArticle?.id,
        ...secondaryHero.map((a) => a.id),
        ...generalFeatured.map((a) => a.id),
        ...bastidoresArticles.map((a) => a.id),
      ].filter(Boolean) as string[]

      const isFiltering = !!(category || tag)
      const whereClause: any = { status: 'published' }

      if (!isFiltering) {
        whereClause.id = { notIn: displayedIds }
      } else {
        if (category) whereClause.category = { slug: category }
        if (tag) whereClause.tags = { some: { tag: { slug: tag } } }
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
        bastidoresArticles,
        totalPages: Math.ceil(totalArticles / postsPerPage),
        allTags,
      }
    } catch (error) {
      console.error('Database error in getHomeData:', error)
      if (retries > 0) {
        const delay = (4 - retries) * 1000 // Delay progressivo
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(retries - 1)
      }
      // Em vez de throw, retorna objeto vazio para evitar 500 no Next.js
      return {
        mainFeaturedArticle: null,
        secondaryHero: [],
        generalFeatured: [],
        articles: [],
        bastidoresArticles: [],
        totalPages: 0,
        allTags: [],
      }
    }
  }

  return unstable_cache(
    () => fetchWithRetry(),
    [
      'home-data',
      currentPage.toString(),
      postsPerPage.toString(),
      category || 'all',
      tag || 'all',
    ],
    {
      revalidate: 60,
      tags: ['articles', 'tags'],
    },
  )()
}
