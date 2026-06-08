import { notFound } from 'next/navigation'
import { CategoriaForm } from '../../_components/CategoriaForm'
import { getCategoryById } from '../../_data-access/get-category-by-id'

interface EditCategoriaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoriaPage({
  params,
}: EditCategoriaPageProps) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) {
    return notFound()
  }

  const initialData = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    color: category.color,
    description: category.description,
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b border-black/10 pb-6">
        <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
          Editar <span className="text-narrativa-vermelho">Categoria</span>
        </h2>
        <p className="text-[0.9rem] text-black/40 font-light">
          Atualize os dados da editoria.
        </p>
      </div>

      <CategoriaForm initialData={initialData} />
    </div>
  )
}
