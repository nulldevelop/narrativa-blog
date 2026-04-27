'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const emailSchema = z.string().email('Email inválido')

export async function salvarEmail(email: string) {
  const result = emailSchema.safeParse(email)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const validatedEmail = result.data

  try {
    await prisma.subscriber.create({
      data: {
        email: validatedEmail,
        confirmed: false,
      },
    })
    revalidatePath('/')
    return { success: true }
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return { error: 'Este email já está cadastrado' }
    }
    console.error('Erro ao salvar email:', error)
    return { error: 'Erro ao salvar email' }
  }
}
