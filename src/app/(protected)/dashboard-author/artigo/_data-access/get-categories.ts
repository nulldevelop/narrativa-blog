import { prisma } from '@/lib/prisma'

export async function getCategories() {
  try {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    })
  } catch (error) {
    console.error('Error getting categories:', error)
    return []
  }
}