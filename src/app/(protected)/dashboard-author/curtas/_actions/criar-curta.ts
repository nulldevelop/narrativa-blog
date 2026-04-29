'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function criarCurta(formData: FormData): Promise<void> {
  try {
    const texto = formData.get('texto') as string
    const source = formData.get('source') as string

    if (!texto || texto.trim().length < 5) {
      throw new Error('Texto deve ter pelo menos 5 caracteres')
    }

    await prisma.curta.create({
      data: { texto, source: source || '' },
    })

    revalidatePath('/dashboard-author/curtas')
    revalidatePath('/')

  } catch (error) {
    console.error('Error creating curta:', error)
    throw new Error('Erro ao criar curta')
  }
}
