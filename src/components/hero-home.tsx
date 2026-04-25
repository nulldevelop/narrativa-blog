import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/fade-up";

export interface ArticleHero {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: { name: string } | null;
  createdAt: Date;
  publishedAt: Date | null;
  coverImage: string | null;
}

export interface HeroHomeProps {
  mainArticle: ArticleHero | null;
  secondaryArticles: ArticleHero[];
}

export default function HeroHome({ mainArticle, secondaryArticles }: HeroHomeProps) {
  // Fallbacks para quando não houver nada marcado como destaque
  const defaultMain = {
    slug: "entre-o-discurso-e-o-movimento-silencioso",
    title: "Entre o discurso e o movimento silencioso",
    tag: "Paraná",
    date: "31 de março de 2025",
    subtitle: "A versão oficial é de normalidade. But como quase sempre na política, o que se diz em público não revela completamente o que se constrói nos bastidores.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop"
  };

  const currentMain = mainArticle ? {
    slug: mainArticle.slug,
    title: mainArticle.title,
    tag: mainArticle.category?.name || "Política",
    date: new Date(mainArticle.publishedAt || mainArticle.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    subtitle: mainArticle.subtitle,
    image: mainArticle.coverImage || defaultMain.image
  } : defaultMain;

  return (
    <section
      className="bg-narrativa-preto relative overflow-hidden hero-grid-lines min-h-[400px] flex items-center px-[3rem] lg:px-[4rem] py-[3rem]"
      aria-label="Artigo em destaque"
    >
      <div className="max-w-[1440px] mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.2fr] gap-[2.5rem] items-stretch w-full">
          
          {/* Coluna 1: Texto Principal */}
          <div className="flex flex-col justify-center text-left lg:pr-[2rem] align-self-stretch">
            <FadeUp>
              <h1 className="font-heading text-[2.2rem] font-black text-narrativa-branco leading-[1.1] mb-5 tracking-[-0.02em] uppercase">
                {currentMain.title}
              </h1>
            </FadeUp>

            {currentMain.subtitle && (
              <FadeUp delay={0.1}>
                <p className="text-[1rem] text-white/50 max-w-[440px] leading-[1.7] font-light italic font-serif">
                  {currentMain.subtitle}
                </p>
              </FadeUp>
            )}

            <FadeUp delay={0.2}>
              <div className="mt-[1.5rem] flex flex-col gap-3">
                <Button
                  asChild
                  className="w-fit bg-narrativa-vermelho hover:bg-[#8c0d1c] text-narrativa-branco text-[0.95rem] font-bold tracking-[0.14em] uppercase px-[1.4rem] py-[0.7rem] h-auto rounded-none"
                >
                  <Link href={`/artigo/${currentMain.slug}`}>
                    Leia mais
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </Button>
                <span className="text-[0.85rem] tracking-[0.1em] text-white/25 uppercase font-medium">
                  {currentMain.date}
                </span>
              </div>
            </FadeUp>
          </div>

          {/* Coluna 2: Imagem Central */}
          <FadeUp delay={0.3} className="w-full max-h-[350px] overflow-hidden align-self-stretch">
            <Link 
              href={`/artigo/${currentMain.slug}`}
              className="relative block w-full h-[350px] overflow-hidden group rounded-[4px]"
            >
              <Image
                src={currentMain.image}
                alt={currentMain.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
            </Link>
          </FadeUp>

          {/* Coluna 3: Destaques Secundários (1, 2, 3) */}
          <div className="flex flex-col justify-between align-self-stretch lg:pl-4 gap-6">
            {secondaryArticles.length > 0 ? secondaryArticles.map((item, i) => (
              <FadeUp key={item.slug} delay={0.4 + (i * 0.1)} className="flex-1 flex items-center">
                <Link href={`/artigo/${item.slug}`} className="flex items-center gap-[1.2rem] group w-full">
                  <div className="relative w-[100px] h-[100px] flex-shrink-0 overflow-hidden rounded-[2px] bg-white/5 border border-white/10">
                    <Image 
                      src={item.coverImage || "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"}
                      alt={item.title}
                      fill
                      sizes="100px"
                      className="object-cover transition-all duration-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[0.9rem] font-bold text-white/90 leading-[1.3] group-hover:text-narrativa-vermelho transition-colors line-clamp-2 uppercase tracking-tight">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </FadeUp>
            )) : (
              <div className="flex flex-col justify-center h-full border border-white/5 p-6 bg-white/[0.02]">
                <p className="text-[0.7rem] text-white/20 uppercase tracking-widest font-black italic">Aguardando pauta...</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
