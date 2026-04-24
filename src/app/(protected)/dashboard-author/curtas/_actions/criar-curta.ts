'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function criarCurta(formData: FormData) {
  try {
    const texto = formData.get('texto') as string
    const source = formData.get('source') as string

    if (!texto || texto.trim().length < 5) {
      return { error: 'Texto deve ter pelo menos 5 caracteres' }
    }

    await prisma.curta.create({
      data: { texto, source: source || '' },
    })
    revalidatePath('/curtas')
    revalidatePath('/')
  } catch (error) {
    console.error('Error creating curta:', error)
    return { error: 'Erro ao criar curta' }
  }
}