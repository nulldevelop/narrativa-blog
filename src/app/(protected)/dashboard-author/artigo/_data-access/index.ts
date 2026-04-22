import { prisma } from '@/lib/prisma'

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
}

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
}

export async function getArticleById(id: string) {
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
}
