import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/fade-up";

export function HeroHome() {
  return (
    <section
      className="bg-narrativa-preto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,8vw,7rem)] relative overflow-hidden hero-grid-lines"
      aria-label="Artigo em destaque"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Eyebrow */}
        <p className="text-[0.65rem] tracking-[0.25em] uppercase text-narrativa-vermelho font-bold mb-5 flex items-center gap-3">
          <span className="inline-block w-8 h-0.5 bg-narrativa-vermelho" />
          Análise política
        </p>

        <FadeUp>
          <h1 className="font-heading text-[clamp(2.4rem,6vw,5rem)] font-black text-narrativa-branco leading-[1.05] max-w-[820px] mb-6 tracking-[-0.02em]">
            Entre o discurso e o
            <br />
            <em className="italic text-narrativa-dourado">
              movimento silencioso
            </em>
          </h1>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-white/55 max-w-[560px] leading-[1.65] mb-10 font-light">
            A versão oficial é de normalidade. Mas como quase sempre na
            política, o que se diz em público não revela completamente o que se
            constrói nos bastidores.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="flex items-center gap-6 flex-wrap">
            <Button
              asChild
              className="bg-narrativa-vermelho hover:bg-[#8c0d1c] text-narrativa-branco text-[0.72rem] font-bold tracking-[0.14em] uppercase px-6 py-5 rounded-none"
            >
              <Link href="/artigo/entre-o-discurso-e-o-movimento-silencioso">
                Ler análise
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
            <span className="text-[0.72rem] tracking-[0.1em] text-white/30 uppercase">
              31 de março de 2025
            </span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
