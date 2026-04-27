import slugify from 'slugify'
import { prisma } from '@/lib/prisma'

export const HOME_POSITIONS_CASCADE = [
  'home-principal',
  'home-destaque-1',
  'home-destaque-2',
  'home-destaque-3',
  'home-geral-1',
  'home-geral-2',
  'home-listagem',
]

export async function handleArticleCascade(
  articleId: string,
  newPositionTag: string | null,
  organizationId: string,
) {
  if (!newPositionTag || !HOME_POSITIONS_CASCADE.includes(newPositionTag)) {
    // Se não tem nova posição ou não é uma tag de cascade, apenas remove as tags de cascade existentes do artigo
    await removeCascadeTags(articleId)
    return
  }

  // 1. Buscar todos os artigos que estão atualmente no cascade
  const articlesInCascade = await prisma.article.findMany({
    where: {
      organizationId,
      tags: {
        some: {
          tag: {
            slug: { in: HOME_POSITIONS_CASCADE },
          },
        },
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  // 2. Mapear os artigos por suas posições atuais
  // Usamos um array fixo para representar os slots
  const slots: (string | null)[] = new Array(
    HOME_POSITIONS_CASCADE.length,
  ).fill(null)

  for (const article of articlesInCascade) {
    const currentTag = article.tags.find((t) =>
      HOME_POSITIONS_CASCADE.includes(t.tag.slug),
    )?.tag.slug
    if (currentTag) {
      const index = HOME_POSITIONS_CASCADE.indexOf(currentTag)
      if (index !== -1) {
        // Se o artigo for o que estamos movendo, ignoramos sua posição antiga nos slots para o rearranjo
        if (article.id !== articleId) {
          slots[index] = article.id
        }
      }
    }
  }

  // 3. Inserir o novo artigo na posição desejada e deslocar os outros
  const targetIndex = HOME_POSITIONS_CASCADE.indexOf(newPositionTag)
  const newSlots = [...slots]

  // Deslocamento: removemos o articleId de qualquer lugar que ele pudesse estar (já feito acima ao não adicioná-lo)
  // E agora inserimos no targetIndex, empurrando os outros para baixo
  newSlots.splice(targetIndex, 0, articleId)

  // Limitamos ao tamanho do cascade (quem cair fora perde a tag ou vai pra listagem)
  // Mas espera, o 'home-listagem' é o último. Quem cair fora de 'home-listagem' perde a tag.
  const finalSlots = newSlots.slice(0, HOME_POSITIONS_CASCADE.length)

  // 4. Atualizar o banco de dados
  for (let i = 0; i < finalSlots.length; i++) {
    const id = finalSlots[i]
    if (!id) continue

    const targetTagSlug = HOME_POSITIONS_CASCADE[i]
    const targetTagName = getTagNameFromSlug(targetTagSlug)

    // Remove tags de cascade antigas deste artigo e adiciona a nova
    await updateArticleCascadeTag(
      id,
      targetTagSlug,
      targetTagName,
      organizationId,
    )
  }

  // Opcional: remover tags de cascade de artigos que caíram fora do array (se houver)
  if (newSlots.length > HOME_POSITIONS_CASCADE.length) {
    const fallenOutIds = newSlots
      .slice(HOME_POSITIONS_CASCADE.length)
      .filter((id) => id !== null) as string[]
    for (const id of fallenOutIds) {
      await removeCascadeTags(id)
    }
  }
}

async function removeCascadeTags(articleId: string) {
  // Deleta as relações ArticleTag onde a tag é uma das tags de cascade
  const tagsToRemove = await prisma.tag.findMany({
    where: {
      slug: { in: HOME_POSITIONS_CASCADE },
    },
  })

  if (tagsToRemove.length > 0) {
    await prisma.articleTag.deleteMany({
      where: {
        articleId,
        tagId: { in: tagsToRemove.map((t) => t.id) },
      },
    })
  }
}

async function updateArticleCascadeTag(
  articleId: string,
  tagSlug: string,
  tagName: string,
  organizationId: string,
) {
  // Primeiro remove todas as tags de cascade atuais do artigo
  await removeCascadeTags(articleId)

  // Adiciona a nova tag
  await prisma.articleTag.create({
    data: {
      article: { connect: { id: articleId } },
      tag: {
        connectOrCreate: {
          where: { slug: tagSlug },
          create: {
            name: tagName,
            slug: tagSlug,
            organizationId,
          },
        },
      },
    },
  })
}

function getTagNameFromSlug(slug: string): string {
  const names: Record<string, string> = {
    'home-principal': 'Principal (Home)',
    'home-destaque-1': 'Destaque 1',
    'home-destaque-2': 'Destaque 2',
    'home-destaque-3': 'Destaque 3',
    'home-geral-1': 'Geral 1',
    'home-geral-2': 'Geral 2',
    'home-listagem': 'Listagem',
  }
  return names[slug] || slug
}
