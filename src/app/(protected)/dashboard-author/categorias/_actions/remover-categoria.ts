'use server'

import { revalidatePath } from 'next/cache'
import { checkPermission } from '@/lib/permissions/check-permission'
import { prisma } from '@/lib/prisma'

export async function removerCategoria(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const permission = await checkPermission('delete', 'categories')
  if (!permission.allowed) {
    return {
      success: false,
      error: permission.error || 'Sem permissão para remover categorias',
    }
  }

  if (!id) return { success: false, error: 'ID inválido' }

  const count = await prisma.article.count({ where: { categoryId: id } })
  if (count > 0) {
    return {
      success: false,
      error: `Não é possível remover: há ${count} matéria(s) nesta categoria. Reatribua-as antes.`,
    }
  }

  try {
    await prisma.category.delete({ where: { id } })
  } catch (error) {
    console.error('Error removing category:', error)
    return { success: false, error: 'Erro ao remover categoria' }
  }

  revalidatePath('/dashboard-author/categorias')
  revalidatePath('/')
  return { success: true }
}
