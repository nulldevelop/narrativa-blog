'use server'

import { revalidatePath } from 'next/cache'
import { checkPermission } from '@/lib/permissions/check-permission'
import { prisma } from '@/lib/prisma'

export async function archiveArticleAction(id: string) {
  try {
    // 1. Verificação de Permissão via RBAC
    const permission = await checkPermission('update', 'articles')
    if (!permission.allowed) {
      return { success: false, error: permission.error || 'Não autorizado' }
    }

    // 2. Busca o artigo e valida propriedade
    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!article) return { success: false, error: 'Artigo não encontrado.' }

    if (
      permission.role === 'AUTHOR' &&
      article.authorId !== permission.userId
    ) {
      return {
        success: false,
        error: 'Você não tem permissão para arquivar este artigo.',
      }
    }

    await prisma.article.update({
      where: { id },
      data: { status: 'archived' },
    })

    revalidatePath('/')
    revalidatePath('/dashboard-author')
    revalidatePath('/dashboard-author/artigo')

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao arquivar artigo:', error)
    return { success: false, error: 'Falha ao arquivar o artigo.' }
  }
}
