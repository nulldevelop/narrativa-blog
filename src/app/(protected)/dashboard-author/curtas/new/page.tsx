import { CurtaForm } from '../_components/CurtaForm'

export default function NovaCurtaPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b border-black/10 pb-6">
        <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
          Nova <span className="text-narrativa-vermelho">Curta</span>
        </h2>
        <p className="text-[0.9rem] text-black/40 font-light">
          Adicione uma frase de impacto.
        </p>
      </div>

      <CurtaForm />
    </div>
  )
}
