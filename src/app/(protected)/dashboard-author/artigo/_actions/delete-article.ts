'use server'

import { revalidatePath } from 'next/cache'
import { checkPermission } from '@/lib/permissions/check-permission'
import { prisma } from '@/lib/prisma'

export async function deleteArticleAction(id: string) {
  try {
    // 1. Verificação de Permissão via RBAC
    const permission = await checkPermission('delete', 'articles')
    if (!permission.allowed) {
      return { success: false, error: permission.error || 'Não autorizado' }
    }

    // 2. Busca o artigo e valida propriedade
    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    })

    if (!article) return { success: false, error: 'Artigo não encontrado.' }

    // Validação de propriedade para autores
    if (
      permission.role === 'AUTHOR' &&
      article.authorId !== permission.userId
    ) {
      return {
        success: false,
        error: 'Você não tem permissão para excluir este artigo.',
      }
    }

    // Regra de Negócio: Apenas matérias arquivadas podem ser excluídas permanentemente
    if (article.status !== 'archived') {
      return {
        success: false,
        error:
          'Apenas matérias arquivadas podem ser excluídas permanentemente.',
      }
    }

    await prisma.article.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/dashboard-author')
    revalidatePath('/dashboard-author/artigo')

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir artigo:', error)
    return { success: false, error: 'Falha ao excluir o artigo.' }
  }
}
