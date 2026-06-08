'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { checkPermission } from '@/lib/permissions/check-permission'
import { prisma } from '@/lib/prisma'

export async function criarCategoria(formData: FormData): Promise<void> {
  const permission = await checkPermission('create', 'categories')
  if (!permission.allowed) {
    throw new Error(permission.error || 'Sem permissão para criar categorias')
  }

  const name = (formData.get('name') as string)?.trim()
  const rawSlug = (formData.get('slug') as string)?.trim()
  const color = (formData.get('color') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()

  if (!name || name.length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres')
  }

  const slug = slugify(rawSlug || name, { lower: true, strict: true })
  if (!slug) throw new Error('Slug inválido')

  const exists = await prisma.category.findUnique({ where: { slug } })
  if (exists) throw new Error(`Já existe uma categoria com o slug "${slug}"`)

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        color: color || null,
        description: description || null,
        organizationId: permission.organizationId || null,
      },
    })
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error('Erro ao criar categoria')
  }

  revalidatePath('/dashboard-author/categorias')
  revalidatePath('/')
}
