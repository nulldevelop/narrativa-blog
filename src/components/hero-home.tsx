import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeUp } from "@/components/fade-up";

export interface ArticleHero {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: { name: string } | null;
  tags: { tag: { name: string; slug: string } }[];
  createdAt: Date;
  publishedAt: Date | null;
  coverImage: string | null;
}

export interface HeroHomeProps {
  mainArticle: ArticleHero | null;
  secondaryArticles: (ArticleHero | null)[];
}

export default function HeroHome({ mainArticle, secondaryArticles = [] }: HeroHomeProps) {
  const defaultMain = {
    slug: "entre-o-discurso-e-o-movimento-silencioso",
    title: "Entre o discurso e o movimento silencioso",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop"
  };

  const currentMain = mainArticle ? {
    slug: mainArticle.slug,
    title: mainArticle.title,
    image: mainArticle.coverImage || defaultMain.image
  } : defaultMain;

  return (
    <section
      className="bg-narrativa-preto relative overflow-hidden hero-grid-lines min-h-[400px] flex items-center px-[clamp(1.25rem,4vw,4rem)] py-[clamp(2rem,4vw,3rem)]"
      aria-label="Artigo em destaque"
    >
      <div className="max-w-[1440px] mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.2fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-stretch w-full">

          {/* Coluna 1: Texto Principal */}
          <div className="flex flex-col justify-center text-left lg:pr-[2rem] align-self-stretch">
            <FadeUp>
              <h1 className="font-heading text-[clamp(1.6rem,4.5vw,2.2rem)] font-black text-narrativa-branco leading-[1.1] mb-5 tracking-[-0.02em] uppercase text-left">
                {currentMain.title}
              </h1>
            </FadeUp>
          </div>

          {/* Destaque Principal */}
          <FadeUp className="w-full h-full">
            <Link
              href={`/artigo/${currentMain.slug}`}
              className="relative block w-full h-[clamp(200px,45vw,350px)] overflow-hidden group rounded-[4px] bg-white/5"
            >
              <Image
                src={currentMain.image}
                alt={currentMain.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h1 className="font-heading text-[1.6rem] font-black text-white leading-[1.15] uppercase tracking-[-0.02em] group-hover:text-narrativa-vermelho transition-colors line-clamp-3">
                  {currentMain.title}
                </h1>
              </div>
            </Link>
          </FadeUp>

          {/* Coluna 3: Destaques Secundários (1, 2, 3) */}
          <div className="flex flex-col justify-between align-self-stretch lg:pl-4 gap-[clamp(0.75rem,2vw,1.5rem)]">
            {[0, 1, 2].map((i) => {
              const item = secondaryArticles[i] ?? null
              if (!item) return (
                <div key={i} className="flex-1 flex items-center border border-white/5 p-4 bg-white/[0.02]">
                  <p className="text-[0.65rem] text-white/15 uppercase tracking-widest font-black italic">Destaque {i + 1} — aguardando pauta</p>
                </div>
              )
              return (
                <FadeUp key={item.slug} delay={0.1 + (i * 0.05)} className="flex-1">
                  <Link href={`/artigo/${item.slug}`} className="relative block w-full h-full min-h-[155px] overflow-hidden rounded-[2px] group">
                    <Image
                      src={item.coverImage || "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-[0.82rem] font-bold text-white leading-[1.3] line-clamp-2 uppercase tracking-tight group-hover:text-narrativa-vermelho transition-colors">
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
  );
}
