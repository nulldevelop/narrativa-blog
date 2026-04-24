import { prisma } from '@/lib/prisma'

export const getCurtaById = async (id: string) => {
  try {
    return await prisma.curta.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error getting curta by id:', error)
    return null
  }
}