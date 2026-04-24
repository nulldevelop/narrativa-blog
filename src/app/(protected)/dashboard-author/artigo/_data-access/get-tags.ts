import { prisma } from '@/lib/prisma'

export async function getTags() {
  try {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    })
  } catch (error) {
    console.error('Error getting tags:', error)
    return []
  }
}