import type { ArticleHero } from '@/components/hero-home'
import { prisma } from '@/lib/prisma'

/**
 * Busca um artigo pelo slug com autor, categoria e tags.
 */
export const getArticleBySlug = async (slug: string) => {
  return await prisma.article.update({
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
}

/**
 * Busca o primeiro artigo publicado que possua uma tag específica.
 */
export const fetchByTag = async (
  tagSlug: string,
): Promise<ArticleHero | null> => {
  return (await prisma.article.findFirst({
    where: {
      status: 'published',
      tags: { some: { tag: { slug: tagSlug } } },
    },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  })) as ArticleHero | null
}

/**
 * Busca o último artigo publicado de uma categoria específica.
 */
export const fetchByCategory = async (
  categorySlug: string,
): Promise<ArticleHero | null> => {
  return (await prisma.article.findFirst({
    where: {
      status: 'published',
      category: { slug: categorySlug },
    },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  })) as ArticleHero | null
}

/**
 * Busca todas as tags que possuem pelo menos um artigo publicado.
 */
export const getAllTags = async () => {
  return await prisma.tag.findMany({
    where: {
      articles: { some: { article: { status: 'published' } } },
      slug: {
        notIn: [
          'home-principal',
          'home-destaque-1',
          'home-destaque-2',
          'home-destaque-3',
          'home-geral-1',
          'home-geral-2',
        ],
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
  })
}

/**
 * Busca os dados para a home: artigos em destaque (via tags) e listagem geral paginada.
 */
export const getHomeData = async (
  currentPage: number,
  postsPerPage: number,
  category?: string,
  tag?: string,
) => {
  // 1. Buscar todos os destaques em paralelo
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

  // Organizar arrays de destaques para os componentes
  const secondaryHero = [d1, d2, d3].filter(Boolean) as ArticleHero[]
  const generalFeatured = [dGeral1, dGeral2].filter(Boolean) as ArticleHero[]

  // IDs para excluir da listagem comum e evitar duplicatas
  const featuredIds = new Set(
    [
      mainFeaturedArticle?.id,
      ...secondaryHero.map((a) => a.id),
      ...generalFeatured.map((a) => a.id),
    ].filter((id): id is string => !!id),
  )

  // 2. Buscar Listagem Geral (excluindo os já destacados)
  // Se estiver filtrando por TAG ou CATEGORIA, removemos a exclusão dos destaques para garantir que apareçam
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
}
