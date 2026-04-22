import { prisma } from '@/lib/prisma'

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1. Criar Organização Inicial
  const organization = await prisma.organization.upsert({
    where: { slug: 'narrativa' },
    update: {},
    create: {
      name: 'Narrativa — Política e Poder',
      slug: 'narrativa',
      email: 'contato@narrativa.com.br',
      status: 'ACTIVE',
      cnpj: '00.000.000/0001-00',
      telefone: '(41) 99999-9999',
      metadata: JSON.stringify({
        description:
          'Matéria política com profundidade. O que está por trás do discurso público.',
        city: 'Curitiba',
        state: 'PR',
      }),
    },
  })

  console.log(`✅ Organização criada/confirmada: ${organization.name}`)

  // 2. Criar Módulos Iniciais
  const modulos = [
    { key: 'articles', name: 'Artigos' },
    { key: 'categories', name: 'Categorias' },
    { key: 'newsletter', name: 'Newsletter' },
    { key: 'users', name: 'Usuários' },
  ]

  for (const mod of modulos) {
    await prisma.modulo.upsert({
      where: {
        organizationId_key: {
          organizationId: organization.id,
          key: mod.key,
        },
      },
      update: {},
      create: {
        key: mod.key,
        organizationId: organization.id,
      },
    })
  }

  console.log('✅ Módulos do sistema criados.')

  // 4. Criar Categorias Editoriais (ESSENCIAL para as matérias)
  const categoriasEditoriais = [
    { name: 'Política', slug: 'politica' },
    { name: 'Paraná', slug: 'parana' },
    { name: 'Brasil', slug: 'brasil' },
    { name: 'Curitiba', slug: 'curitiba' },
    { name: 'Bastidores', slug: 'bastidores' },
  ]

  for (const cat of categoriasEditoriais) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        organizationId: organization.id,
      },
    })
  }

  console.log('✅ Categorias editoriais criadas.')
  console.log('✨ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
