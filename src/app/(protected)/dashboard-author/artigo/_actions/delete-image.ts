'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

export async function deleteImageAction(imageUrl: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { success: false, error: 'Sessão expirada ou não encontrada.' }
    }

    // A URL tem o formato: /api/media/materia/[articleId]/imagens/[fileName]
    const parts = imageUrl.split('/')
    // parts[0] = '', parts[1] = 'api', parts[2] = 'media', parts[3] = 'materia', 
    // parts[4] = articleId, parts[5] = 'imagens', parts[6] = fileName
    
    if (parts.length < 7 || parts[3] !== 'materia') {
      return { success: false, error: 'URL de imagem inválida.' }
    }

    const articleId = parts[4]
    const fileName = parts[6]

    const filePath = path.join(
      process.cwd(),
      'storage',
      'materia',
      articleId,
      'imagens',
      fileName
    )

    // Verificar se o arquivo existe
    try {
      await fs.access(filePath)
    } catch (e) {
      return { success: false, error: 'Arquivo não encontrado no servidor.' }
    }

    // Excluir o arquivo
    await fs.unlink(filePath)

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir imagem:', error)
    return { success: false, error: error.message || 'Falha ao excluir a imagem.' }
  }
}
