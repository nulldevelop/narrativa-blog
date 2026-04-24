import { prisma } from '@/lib/prisma'

/**
 * Busca todas as tags que possuem pelo menos um artigo publicado.
 */
export const getAllTags = async () => {
  try {
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
  } catch (error) {
    console.error('Error getting all tags:', error)
    return []
  }
}