import { prisma } from '@/lib/prisma'

export async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        description: true,
        _count: { select: { articles: true } },
      },
    })
  } catch (error) {
    console.error('Error getting categories:', error)
    return []
  }
}
