'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function archiveArticleAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { success: false, error: 'Sessão expirada ou não encontrada.' }
    }

    const userId = session.user.id

    // Verificar se o artigo pertence ao autor ou se o usuário é ADMIN/EDITOR
    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true }
    })

    if (!article) {
      return { success: false, error: 'Artigo não encontrado.' }
    }

    if (article.authorId !== userId && !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return { success: false, error: 'Você não tem permissão para arquivar este artigo.' }
    }

    await prisma.article.update({
      where: { id },
      data: {
        status: 'archived'
      }
    })

    revalidatePath('/')
    revalidatePath('/dashboard-author')
    revalidatePath('/dashboard-author/artigo')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Falha ao arquivar o artigo.' }
  }
}
