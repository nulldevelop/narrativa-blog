import fs from 'node:fs/promises'
import path from 'node:path'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  // 1. Verificar Autenticação
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    // SunEditor v3 envia o arquivo como 'file-0'; sidebar envia como 'file'
    const file = (formData.get('file-0') ?? formData.get('file')) as File
    // articleId via header (v3) ou form field (sidebar)
    const reqHeaders = await headers()
    const articleId = (reqHeaders.get('x-article-id') || (formData.get('articleId') as string) || 'temp')

    // Validação do articleId para evitar Path Traversal
    if (!/^[a-zA-Z0-9-]+$/.test(articleId)) {
      return NextResponse.json(
        { error: 'ID de artigo inválido' },
        { status: 400 },
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 },
      )
    }

    // 2. Validação de Tamanho (DoS Prevention)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'O arquivo excede o limite de 5MB' },
        { status: 400 },
      )
    }

    // 3. Validação de Tipo de Arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.' },
        { status: 400 },
      )
    }

    // 4. Preparar diretório de destino
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const rootMateriaPath = path.resolve(process.cwd(), 'storage', 'materia')
    const storagePath = path.resolve(rootMateriaPath, articleId, 'imagens')

    // Validação extra: Garante que o caminho final está dentro de storage/materia
    if (!storagePath.startsWith(rootMateriaPath)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    await fs.mkdir(storagePath, { recursive: true })

    // Nome sanitizado e único
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${Date.now()}-${sanitizedName}`
    const filePath = path.join(storagePath, fileName)

    // 5. Salvar no Disco
    await fs.writeFile(filePath, buffer)

    const url = `/api/media/materia/${articleId}/imagens/${fileName}`

    // Retorna em ambos os formatos: { url } para sidebar, { result } para SunEditor v3
    return NextResponse.json({
      url,
      result: [{ url, name: fileName, size: file.size }],
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Falha ao processar upload' },
      { status: 500 },
    )
  }
}
