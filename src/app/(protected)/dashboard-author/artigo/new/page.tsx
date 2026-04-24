import { ArticleForm } from '../_components/ArticleForm'
import { getCategories } from '../_data-access/get-categories'

export default async function NewArticlePage() {
  const categories = await getCategories()

  return (
    <div className="bg-white border border-black/5 p-8 shadow-sm">
      <ArticleForm categories={categories} />
    </div>
  )
}
