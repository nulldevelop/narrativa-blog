'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function salvarEmail(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' }
  }

  try {
    await prisma.subscriber.create({
      data: {
        email,
        confirmed: false,
      },
    })
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return { error: 'Este email já está cadastrado' }
    }
    console.error('Erro ao salvar email:', error)
    return { error: 'Erro ao salvar email' }
  }
}
