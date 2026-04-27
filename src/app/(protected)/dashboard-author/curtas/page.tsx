import { Edit2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { removerCurta } from './_actions/remover-curta'
import { getAllCurtas } from './_data-access/get-all-curtas'

export default async function CurtasPage() {
  const curtas = await getAllCurtas()

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-black/10 pb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
            Curtas &{' '}
            <em className="italic text-narrativa-vermelho font-serif">
              Diretas
            </em>
          </h2>
          <p className="text-[0.9rem] text-black/40 font-light">
            Frases de impacto para o site.
          </p>
        </div>
        <Button
          asChild
          className="rounded-none bg-narrativa-preto text-[0.7rem] font-bold tracking-[0.15em] uppercase h-11 px-6"
        >
          <Link href="/dashboard-author/curtas/new">
            <Plus className="w-4 h-4 mr-2" /> Nova Curta
          </Link>
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {curtas.length > 0 ? (
            curtas.map((curta) => (
              <div
                key={curta.id}
                className="bg-white border border-black/5 p-6 shadow-sm group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[1.1rem] font-light text-narrativa-preto leading-relaxed">
                      "{curta.texto}"
                    </p>
                    {curta.source && (
                      <p className="text-[0.75rem] text-black/40 mt-3 font-light">
                        — {curta.source}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-narrativa-preto hover:text-narrativa-vermelho hover:bg-black/5"
                    >
                      <Link href={`/dashboard-author/curtas/edit/${curta.id}`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>
                    <form action={removerCurta}>
                      <input type="hidden" name="id" value={curta.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-black/5">
              <p className="text-[0.9rem] text-black/40 italic font-serif">
                Nenhuma curta cadastrada.
              </p>
              <Button
                asChild
                variant="link"
                className="text-narrativa-vermelho mt-4"
              >
                <Link href="/dashboard-author/curtas/new">
                  Criar primeira curta
                </Link>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
