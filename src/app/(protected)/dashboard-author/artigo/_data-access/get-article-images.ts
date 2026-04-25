import fs from 'fs/promises'
import path from 'path'

export async function getArticleImages(articleId: string) {
  try {
    const storagePath = path.join(
      process.cwd(),
      'storage',
      'materia',
      articleId,
      'imagens',
    )

    try {
      await fs.access(storagePath)
    } catch (e) {
      // Se o diretório não existe, não há imagens
      return []
    }

    const files = await fs.readdir(storagePath)

    // Filtrar apenas arquivos (ignorar diretórios se houver) e retornar URLs
    const imageUrls = files.map(
      (fileName) => `/api/media/materia/${articleId}/imagens/${fileName}`,
    )

    return imageUrls
  } catch (error) {
    console.error('Erro ao ler imagens do artigo:', error)
    return []
  }
}
