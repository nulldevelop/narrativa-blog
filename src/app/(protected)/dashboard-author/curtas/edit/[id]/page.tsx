import { notFound } from 'next/navigation'
import { getCurtaById } from '../../_data-access/get-curta-by-id'
import { CurtaForm } from '../../_components/CurtaForm'

interface EditCurtaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCurtaPage({ params }: EditCurtaPageProps) {
  const { id } = await params
  const curta = await getCurtaById(id)

  if (!curta) {
    return notFound()
  }

  const initialData = {
    id: curta.id,
    texto: curta.texto,
    source: curta.source,
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b border-black/10 pb-6">
        <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
          Editar <span className="text-narrativa-vermelho">Curta</span>
        </h2>
        <p className="text-[0.9rem] text-black/40 font-light">
          Atualize a frase de impacto.
        </p>
      </div>

      <CurtaForm initialData={initialData} />
    </div>
  )
}
