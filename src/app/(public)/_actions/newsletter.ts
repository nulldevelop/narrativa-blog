'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendConfirmationEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

const emailSchema = z.string().email('Email inválido')

export async function salvarEmail(email: string) {
  const result = emailSchema.safeParse(email)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const validatedEmail = result.data

  try {
    const confirmToken = randomBytes(32).toString('hex')

    await prisma.subscriber.create({
      data: {
        email: validatedEmail,
        confirmed: false,
        confirmToken,
      },
    })

    await sendConfirmationEmail(validatedEmail, confirmToken)

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
