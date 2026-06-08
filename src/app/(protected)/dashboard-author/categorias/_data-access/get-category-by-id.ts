import { prisma } from '@/lib/prisma'

export const getCategoryById = async (id: string) => {
  try {
    return await prisma.category.findUnique({ where: { id } })
  } catch (error) {
    console.error('Error getting category by id:', error)
    return null
  }
}
