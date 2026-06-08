'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { checkPermission } from '@/lib/permissions/check-permission'
import { prisma } from '@/lib/prisma'

export async function editarCategoria(formData: FormData): Promise<void> {
  const permission = await checkPermission('update', 'categories')
  if (!permission.allowed) {
    throw new Error(permission.error || 'Sem permissão para editar categorias')
  }

  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  const rawSlug = (formData.get('slug') as string)?.trim()
  const color = (formData.get('color') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()

  if (!id) throw new Error('ID inválido')
  if (!name || name.length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres')
  }

  const slug = slugify(rawSlug || name, { lower: true, strict: true })
  if (!slug) throw new Error('Slug inválido')

  const conflict = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  })
  if (conflict) throw new Error(`Já existe outra categoria com o slug "${slug}"`)

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        color: color || null,
        description: description || null,
      },
    })
  } catch (error) {
    console.error('Error editing category:', error)
    throw new Error('Erro ao editar categoria')
  }

  revalidatePath('/dashboard-author/categorias')
  revalidatePath('/')
}
