'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { criarCurta } from '../_actions/criar-curta'
import { editarCurta } from '../_actions/editar-curta'

interface CurtaFormProps {
  initialData?: {
    id: string
    texto: string
    source: string | null
  }
}

export function CurtaForm({ initialData }: CurtaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      if (initialData?.id) {
        formData.append('id', initialData.id)
        await editarCurta(formData)
        toast.success('Curta atualizada com sucesso!')
      } else {
        await criarCurta(formData)
        toast.success('Curta criada com sucesso!')
      }

      router.push('/dashboard-author/curtas')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar curta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="texto"
          className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
        >
          Texto da Curta
        </Label>
        <Textarea
          id="texto"
          name="texto"
          required
          defaultValue={initialData?.texto}
          placeholder="Digite a frase de impacto..."
          className="rounded-none border-narrativa-cinza-linha px-4 py-3 text-[0.95rem] min-h-[120px] resize-none focus:border-narrativa-preto"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="source"
          className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
        >
          Origem / Fonte (opcional)
        </Label>
        <Input
          id="source"
          name="source"
          defaultValue={initialData?.source || ''}
          placeholder="Ex: Autor ou contexto"
          className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-none bg-narrativa-preto hover:bg-narrativa-vermelho text-narrativa-branco text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6 transition-colors"
        >
          {loading ? 'Salvando...' : initialData?.id ? 'Atualizar Curta' : 'Salvar Curta'}
        </Button>
        <Button
          type="button"
          asChild
          variant="outline"
          className="rounded-none border-narrativa-cinza-linha text-narrativa-cinza-texto text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6"
        >
          <Link href="/dashboard-author/curtas">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}
