import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return null
    }

    const [
      myTotalArticles,
      myPublishedArticles,
      myDraftArticles,
      totalViews,
    ] = await Promise.all([
      prisma.article.count({ where: { authorId: session.user.id } }),
      prisma.article.count({
        where: { authorId: session.user.id, status: 'published' },
      }),
      prisma.article.count({
        where: { authorId: session.user.id, status: 'draft' },
      }),
      prisma.article.aggregate({
        where: { authorId: session.user.id },
        _sum: {
          views: true,
        },
      }),
    ])

    return {
      total: myTotalArticles,
      published: myPublishedArticles,
      draft: myDraftArticles,
      totalViews: totalViews._sum.views || 0,
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return null
  }
}

export async function getRecentArticles() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return []
    }

    return await prisma.article.findMany({
      where: { authorId: session.user.id },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { category: true },
    })
  } catch (error) {
    console.error('Error getting recent articles:', error)
    return []
  }
}

export async function getTopArticles() {
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
        status: 'published'
      },
      take: 5,
      orderBy: { views: 'desc' },
      include: { category: true },
    })
  } catch (error) {
    console.error('Error getting top articles:', error)
    return []
  }
}
