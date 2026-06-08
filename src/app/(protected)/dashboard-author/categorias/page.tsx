import { Edit2, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DeleteCategoryButton } from './_components/DeleteCategoryButton'
import { getAllCategories } from './_data-access/get-all-categories'

export default async function CategoriasPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-black/10 pb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
            Categorias
          </h2>
          <p className="text-[0.9rem] text-black/40 font-light">
            Organize as matérias do site por editoria.
          </p>
        </div>
        <Button
          asChild
          className="rounded-none bg-narrativa-preto text-[0.7rem] font-bold tracking-[0.15em] uppercase h-11 px-6"
        >
          <Link href="/dashboard-author/categorias/new">
            <Plus className="w-4 h-4 mr-2" /> Nova Categoria
          </Link>
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-black/5 p-5 shadow-sm group flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                    style={{
                      backgroundColor: category.color || '#e5e5e5',
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-bold text-narrativa-preto leading-tight truncate">
                      {category.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[0.65rem] tracking-[0.08em] uppercase text-black/40 font-mono">
                        /{category.slug}
                      </span>
                      <span className="text-[0.65rem] tracking-[0.08em] uppercase text-black/30">
                        {category._count.articles} matéria
                        {category._count.articles === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-narrativa-preto hover:text-narrativa-vermelho hover:bg-black/5"
                  >
                    <Link
                      href={`/dashboard-author/categorias/edit/${category.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <DeleteCategoryButton id={category.id} name={category.name} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-black/5">
              <p className="text-[0.9rem] text-black/40 italic font-serif">
                Nenhuma categoria cadastrada.
              </p>
              <Button
                asChild
                variant="link"
                className="text-narrativa-vermelho mt-4"
              >
                <Link href="/dashboard-author/categorias/new">
                  Criar primeira categoria
                </Link>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
