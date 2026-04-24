'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { criarCurta } from '../_actions/criar-curta'

export default function NovaCurtaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await criarCurta(formData)
      toast.success('Curta criada com sucesso!')
      router.push('/dashboard-author/curtas')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar curta')
    } finally {
      setLoading(false)
    }
  }

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
            {loading ? 'Salvando...' : 'Salvar Curta'}
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
    </div>
  )
}
