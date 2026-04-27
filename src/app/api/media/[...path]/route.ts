import fs from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: filePathArray } = await params

  // 1. Define o diretório base absoluto e resolve o caminho solicitado
  const rootStoragePath = path.join(process.cwd(), 'storage')
  const requestedPath = path.resolve(
    path.join(rootStoragePath, ...filePathArray),
  )

  // 2. Validação de Segurança: Garante que o caminho resolvido permanece dentro do storage
  if (!requestedPath.startsWith(rootStoragePath)) {
    return new Response('Acesso negado', { status: 403 })
  }

  try {
    const fileBuffer = await fs.readFile(requestedPath)

    // Identificação básica de tipo MIME pela extensão
    const ext = path.extname(requestedPath).toLowerCase()
    let contentType = 'application/octet-stream'

    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.svg') contentType = 'image/svg+xml'

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    return new Response('Arquivo não encontrado', { status: 404 })
  }
}
