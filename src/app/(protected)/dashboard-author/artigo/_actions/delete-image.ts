'use server'

import fs from 'fs/promises'
import { headers } from 'next/headers'
import path from 'path'
import { auth } from '@/lib/auth'

async function findAndDeleteFile(
  basePath: string,
  articleId: string,
  fileName: string,
) {
  const tempIdPattern = /^novo-\d+-[a-z0-9]+$/

  const directPath = path.join(basePath, articleId, 'imagens', fileName)
  try {
    await fs.access(directPath)
    await fs.unlink(directPath)
    return { success: true }
  } catch {
    // Não achou no caminho direto
  }

  if (!tempIdPattern.test(articleId)) {
    try {
      const storageBase = path.join(basePath, articleId)

      try {
        await fs.access(storageBase)
      } catch {
        return { success: true }
      }

      try {
        const tempFolders = await fs.readdir(storageBase)

        for (const folder of tempFolders) {
          if (tempIdPattern.test(folder)) {
            const tempPath = path.join(storageBase, folder, 'imagens', fileName)
            try {
              await fs.access(tempPath)
              await fs.unlink(tempPath)

              try {
                await fs.rm(path.join(storageBase, folder, 'imagens'))
              } catch {}
              try {
                await fs.rm(path.join(storageBase, folder))
              } catch {}

              return { success: true }
            } catch {
              // Continua procurando
            }
          }
        }
      } catch {
        // Erro ao ler pasta
      }
    } catch {
      // Pasta base não existe
    }
  }

  return { success: true, error: undefined }
}

export async function deleteImageAction(
  imageUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { success: false, error: 'Sessão expirada ou não encontrada.' }
    }

    const parts = imageUrl.split('/')

    if (parts.length < 7 || parts[3] !== 'materia') {
      return { success: false, error: 'URL de imagem inválida.' }
    }

    const articleId = parts[4]
    const fileName = parts[6]

    const basePath = path.join(process.cwd(), 'storage', 'materia')

    return await findAndDeleteFile(basePath, articleId, fileName)
  } catch (error: any) {
    console.error('Erro ao excluir imagem:', error)
    return {
      success: false,
      error: error.message || 'Falha ao excluir a imagem.',
    }
  }
}
