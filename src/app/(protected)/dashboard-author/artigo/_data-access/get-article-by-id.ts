import { prisma } from '@/lib/prisma'

export async function getArticleById(id: string) {
  try {
    return prisma.article.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error getting article by id:', error)
    return null
  }
}