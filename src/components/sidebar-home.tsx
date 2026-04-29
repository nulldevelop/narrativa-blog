import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import { fetchAllByCategory } from '@/app/(public)/_data-access'
import { NewsletterWidget } from '@/components/newsletter-widget'
import { prisma } from '@/lib/prisma'

interface SidebarHomeProps {
  tags: { id: string; name: string; slug: string }[]
}

const getCurtas = unstable_cache(
  async () => {
    try {
      return await prisma.curta.findMany({
        orderBy: { createdAt: 'desc' },
        where: { status: 'active' },
        take: 20,
      })
    } catch {
      return []
    }
  },
  ['curtas-active'],
  {
    revalidate: 3600, // 1 hora
    tags: ['curtas'],
  }
)

export async function SidebarHome({ tags }: SidebarHomeProps) {
  // Chamamos de forma sequencial ou garantimos que ambos usem o cache global
  const curtas = await getCurtas()
  const cotidianoArticles = await fetchAllByCategory('cotidiano')

  // Agrupar curtas por data
  const groupedCurtas = curtas.reduce((acc, curta) => {
    const date = new Date(curta.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(curta)
    return acc
  }, {} as Record<string, typeof curtas>)

  const sortedDates = Object.keys(groupedCurtas).sort((a, b) => {
    const dateA = a.split('/').reverse().join('-')
    const dateB = b.split('/').reverse().join('-')
    return dateB.localeCompare(dateA)
  })

  return (
    <aside className="flex flex-col gap-8" aria-label="Coluna lateral">
      {/* Curtas & Diretas */}
      <div className="bg-[#0b0b0b] p-6 shadow-xl">
        <h3 className="text-[0.85rem] font-bold tracking-[0.2em] uppercase text-white mb-2">
          CURTAS & DIRETAS
        </h3>
        <div className="w-10 h-[2px] bg-[#e63030] mb-6" />

        <div className="max-height-sidebar-scroll overflow-y-auto pr-1 flex flex-col gap-6 max-h-[550px] custom-scrollbar">
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <div key={date} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[0.6rem] font-bold text-white/30 uppercase tracking-[0.2em]">
                    {date === new Date().toLocaleDateString('pt-BR') ? 'HOJE' : date}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                {groupedCurtas[date].map((curta) => (
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
                ))}
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

      {/* Tags fixas (Temas) */}
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-narrativa-vermelho mb-3">
          Temas
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: 'Curitiba', slug: 'curitiba' },
            { name: 'Paraná', slug: 'parana' },
            { name: 'Brasil', slug: 'brasil' },
            { name: 'Cotidiano', slug: 'cotidiano' },
            { name: 'Bastidores', slug: 'bastidores' },
          ].map((tag) => (
            <Link
              key={tag.slug}
              href={`/?tag=${tag.slug}`}
              className="inline-block border border-narrativa-cinza-linha px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase text-narrativa-cinza-texto hover:border-narrativa-preto hover:bg-narrativa-preto hover:text-narrativa-branco transition-all"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Cotidiano */}
      {cotidianoArticles.length > 0 && (
        <div className="mt-4 flex flex-col gap-6">
          <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-narrativa-vermelho -mb-2">
            Cotidiano
          </p>
          
          {cotidianoArticles.map((article) => (
            <Link
              key={article.id}
              href={`/artigo/${article.slug}`}
              className="group block border-b border-narrativa-cinza-linha pb-6 last:border-0"
            >
              <div className="relative aspect-[16/9] w-full mb-3 overflow-hidden transition-all duration-500">
                <Image
                  src={article.coverImage || '/imgs/logo.png'}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="text-[1rem] font-bold text-narrativa-preto leading-tight group-hover:text-narrativa-vermelho transition-colors uppercase tracking-tight">
                {article.title}
              </h4>
            </Link>
          ))}
        </div>
      )}
    </aside>
  )
}
