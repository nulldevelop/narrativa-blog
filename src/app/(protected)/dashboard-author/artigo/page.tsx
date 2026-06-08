import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getArticlesByAuthor } from './_data-access/get-articles-by-author'
import { auth } from '@/lib/auth'
import { ArticleManager } from './_components/ArticleManager'

export default async function AuthorArticlesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  const articles = await getArticlesByAuthor()

  return <ArticleManager articles={articles} />
}
