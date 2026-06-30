import Image from 'next/image'
import Link from 'next/link'
import { FadeUp } from '@/components/fade-up'

export interface ArticleHero {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: { name: string } | null
  tags: { tag: { name: string; slug: string } }[]
  createdAt: Date
  publishedAt: Date | null
  coverImage: string | null
}

export interface HeroHomeProps {
  mainArticle: ArticleHero | null
  secondaryArticles: (ArticleHero | null)[]
}

export default function HeroHome({
  mainArticle,
  secondaryArticles = [],
}: HeroHomeProps) {
  const defaultMain = {
    slug: 'entre-o-discurso-e-o-movimento-silencioso',
    title: 'Entre o discurso e o movimento silencioso',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop',
  }

  const currentMain = mainArticle
    ? {
        slug: mainArticle.slug,
        title: mainArticle.title,
        image: mainArticle.coverImage || defaultMain.image,
      }
    : defaultMain

  return (
    <section
      className="bg-narrativa-preto relative overflow-hidden hero-grid-lines min-h-[400px] flex items-center px-[clamp(1rem,4vw,4rem)] py-[clamp(1rem,4vw,3rem)]"
      aria-label="Artigo em destaque"
    >
      <div className="max-w-[1440px] mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[clamp(1rem,2vw,1.5rem)] items-stretch w-full">
          {/* Destaque Principal */}
          <FadeUp className="w-full h-full">
            <Link
              href={`/artigo/${currentMain.slug}`}
              className="relative block w-full h-[clamp(280px,50vw,520px)] overflow-hidden group rounded-[4px] bg-white/5"
            >
              <Image
                src={currentMain.image}
                alt={currentMain.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h1 className="font-heading text-[clamp(1rem,2.5vw,1.8rem)] font-black text-white leading-[1.15] uppercase tracking-[-0.02em] group-hover:text-narrativa-vermelho transition-colors line-clamp-3">
                  {currentMain.title}
                </h1>
              </div>
            </Link>
          </FadeUp>

          {/* Destaques Secundários */}
          <div className="flex flex-col gap-[clamp(0.75rem,1.5vw,1rem)] h-full">
            {[0, 1].map((i) => {
              const item = secondaryArticles[i] ?? null
              if (!item)
                return (
                  <div
                    key={i}
                    className="flex-1 flex items-center border border-white/5 p-4 bg-white/[0.02]"
                  >
                    <p className="text-[0.65rem] text-white/15 uppercase tracking-widest font-black italic">
                      Destaque {i + 1} — aguardando pauta
                    </p>
                  </div>
                )
              return (
                <FadeUp
                  key={item.slug}
                  delay={0.1 + i * 0.05}
                  className="flex-1"
                >
                  <Link
                    href={`/artigo/${item.slug}`}
                    className="relative block w-full h-full min-h-[clamp(120px,22vw,240px)] overflow-hidden rounded-[4px] group bg-white/5"
                  >
                    <Image
                      src={
                        item.coverImage ||
                        'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop'
                      }
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-heading text-[clamp(0.8rem,1.2vw,1rem)] font-bold text-white leading-[1.3] line-clamp-2 uppercase tracking-tight group-hover:text-narrativa-vermelho transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
