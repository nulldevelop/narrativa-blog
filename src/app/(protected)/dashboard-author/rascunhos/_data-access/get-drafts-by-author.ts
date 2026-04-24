import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getDraftsByAuthor() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return []
    }

    return await prisma.article.findMany({
      where: {
        authorId: session.user.id,
        status: 'draft',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        category: true,
      },
    })
  } catch (error) {
    console.error('Error getting drafts by author:', error)
    return []
  }
}
