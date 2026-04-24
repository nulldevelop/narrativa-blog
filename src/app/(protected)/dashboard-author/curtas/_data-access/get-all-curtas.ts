import { prisma } from '@/lib/prisma'

export const getAllCurtas = async () => {
  try {
    return await prisma.curta.findMany({
      orderBy: { createdAt: 'desc' },
      where: { status: 'active' },
    })
  } catch (error) {
    console.error('Error getting all curtas:', error)
    return []
  }
}