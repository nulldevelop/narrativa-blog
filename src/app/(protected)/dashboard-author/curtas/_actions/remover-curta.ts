'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function removerCurta(formData: FormData): Promise<void> {
  try {
    const id = formData.get('id') as string
    await prisma.curta.update({
      where: { id },
      data: { status: 'deleted' },
    })
    
    revalidatePath('/dashboard-author/curtas')
    revalidatePath('/')
  } catch (error) {
    console.error('Error removing curta:', error)
    throw new Error('Erro ao remover curta')
  }
}