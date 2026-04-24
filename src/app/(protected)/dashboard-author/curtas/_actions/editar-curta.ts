'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function editarCurta(formData: FormData): Promise<void> {
  try {
    const id = formData.get('id') as string
    const texto = formData.get('texto') as string
    const source = formData.get('source') as string

    if (!texto || texto.trim().length < 5) {
      throw new Error('Texto deve ter pelo menos 5 caracteres')
    }

    await prisma.curta.update({
      where: { id },
      data: { texto, source },
    })
    revalidatePath('/dashboard-author/curtas')
    revalidatePath('/')
  } catch (error) {
    console.error('Error editing curta:', error)
    throw new Error('Erro ao editar curta')
  }
}