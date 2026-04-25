import Link from 'next/link'
import Image from 'next/image'
import { NewsletterWidget } from '@/components/newsletter-widget'
import { prisma } from '@/lib/prisma'
import { fetchByCategory } from '@/app/(public)/_data-access'

interface SidebarHomeProps {
  tags: { id: string; name: string; slug: string }[]
}

async function getCurtas() {
  try {
    return await prisma.curta.findMany({
      orderBy: { createdAt: 'asc' },
      where: { status: 'active' },
      take: 10,
    })
  } catch {
    return []
  }
}

export async function SidebarHome({ tags }: SidebarHomeProps) {
  const [curtas, cotidianoArticle] = await Promise.all([
    getCurtas(),
    fetchByCategory('cotidiano'),
  ])

  return (
    <aside className="flex flex-col gap-8" aria-label="Coluna lateral">
      {/* Curtas & Diretas */}
      <div className="bg-[#0b0b0b] p-6 shadow-xl">
        <h3 className="text-[0.85rem] font-bold tracking-[0.2em] uppercase text-white mb-2">
          CURTAS & DIRETAS
        </h3>
        <div className="w-10 h-[2px] bg-[#e63030] mb-6" />

        <div className="max-height-sidebar-scroll overflow-y-auto pr-1 flex flex-col gap-3 max-h-[480px] custom-scrollbar">
          {curtas.length > 0 ? (
            curtas.map((curta) => (
              <div
                key={curta.id}
                className="bg-white/5 p-[12px_14px] border-l-[3px] border-[#e63030] border-b border-white/[0.08] last:mb-0"
              >
                <p className="italic text-[0.92rem] text-white/90 leading-[1.5] font-serif">
                  <span className="text-[#e63030] mr-2 not-italic">◆</span>
                  {curta.texto}
                </p>
                {curta.source && (
                  <p className="text-[0.7rem] text-white/40 mt-2 font-light">
                    — {curta.source}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-white/40 text-sm">Nenhuma curta cadastrada.</p>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border border-narrativa-cinza-linha p-8">
        <h3 className="text-[1.1rem] font-bold mb-4 pb-3 border-b border-narrativa-cinza-linha">
          Receba avisos de novidades!
        </h3>
        <p className="text-[0.88rem] text-narrativa-cinza-texto leading-[1.7] font-light mb-5">
          Novas publicações diretamente no seu e-mail, sem algoritmo.
        </p>
        <NewsletterWidget />
      </div>

      {/* Quote */}
      <div className="border-l-[3px] border-narrativa-dourado pl-5 py-2">
        <p className="italic text-[0.95rem] text-narrativa-cinza-texto leading-[1.6]">
          &ldquo;Entender o que está acontecendo passa menos pelo que é dito — e
          mais pelo que, cuidadosamente, não é.&rdquo;
        </p>
      </div>

      {/* Tags dinâmicas */}
      {tags.length > 0 && (
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-narrativa-vermelho mb-3">
            Temas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.slug}`}
                className="inline-block border border-narrativa-cinza-linha px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase text-narrativa-cinza-texto hover:border-narrativa-preto hover:bg-narrativa-preto hover:text-narrativa-branco transition-all"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cotidiano */}
      {cotidianoArticle && (
        <div className="mt-4">
          <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-narrativa-vermelho mb-4">
            Cotidiano
          </p>
          <Link href={`/artigo/${cotidianoArticle.slug}`} className="group block">
            <div className="relative aspect-[4/3] w-full mb-3 overflow-hidden transition-all duration-500">
              <Image
                src={cotidianoArticle.coverImage || '/imgs/logo.png'}
                alt={cotidianoArticle.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h4 className="text-[1rem] font-bold text-narrativa-preto leading-tight group-hover:text-narrativa-vermelho transition-colors uppercase tracking-tight">
              {cotidianoArticle.title}
            </h4>
          </Link>
        </div>
      )}
    </aside>
  )
}
