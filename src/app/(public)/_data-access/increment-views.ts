'use server'

import { prisma } from '@/lib/prisma'

export async function incrementArticleViews(slug: string) {
  try {
    await prisma.article.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error('Error incrementing article views:', error)
  }
}
