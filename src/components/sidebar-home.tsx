import Link from "next/link";
import { NewsletterWidget } from "@/components/newsletter-widget";

interface SidebarHomeProps {
  tags: { id: string; name: string; slug: string }[];
}

const curtasEDiretas = [
  "A eleição no Paraná está sendo tratada como disputa de nomes. Mas, na prática, é uma disputa de capacidade.",
  "De um lado, um grupo que governou e tem entrega concreta. Do outro, uma candidatura com força simbólica — mas pouca experiência de gestão estadual.",
  "Isso muda tudo. Porque governar não é discursar. É executar.",
  "Sérgio Moro construiu carreira fora do Executivo. Respeitável — mas distante da rotina real de um governo estadual.",
  "E aqui surge o ponto central: Onde está a experiência de gestão direta?",
  "Enquanto isso, o candidato apoiado pelo governo vem de dentro da máquina. Participou de decisões, execução e articulação.",
  "Não é sobre carisma. É sobre capacidade.",
  "A eleição começa a se organizar assim: quem já fez vs quem ainda precisa provar.",
  "E quando a política chega nesse ponto, o eleitor tende a simplificar: Escolhe segurança ou aposta no desconhecido.",
  "No fim, a pergunta não é quem tem melhor discurso. É quem sabe governar.",
];

export function SidebarHome({ tags }: SidebarHomeProps) {
  return (
    <aside className="flex flex-col gap-8" aria-label="Coluna lateral">
      {/* Curtas & Diretas */}
      <div className="bg-[#0b0b0b] p-6 shadow-xl">
        <h3 className="text-[0.85rem] font-bold tracking-[0.2em] uppercase text-white mb-2">
          CURTAS & DIRETAS
        </h3>
        <div className="w-10 h-[2px] bg-[#e63030] mb-6" />
        
        <div className="max-height-sidebar-scroll overflow-y-auto pr-1 flex flex-col gap-3 max-h-[480px] custom-scrollbar">
          {curtasEDiretas.map((frase, i) => (
            <div 
              key={i} 
              className="bg-white/5 p-[12px_14px] border-l-[3px] border-[#e63030] border-b border-white/[0.08] last:mb-0"
            >
              <p className="italic text-[0.92rem] text-white/90 leading-[1.5] font-serif">
                <span className="text-[#e63030] mr-2 not-italic">◆</span>
                {frase}
              </p>
            </div>
          ))}
        </div>
      </div>

        {/* Newsletter */}
        <div className="border border-narrativa-cinza-linha p-8">
        <h3 className="text-[1.1rem] font-bold mb-4 pb-3 border-b border-narrativa-cinza-linha">
          Receba as matérias
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
    </aside>
  );
}
