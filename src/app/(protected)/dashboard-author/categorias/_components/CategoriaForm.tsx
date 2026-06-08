'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { criarCategoria } from '../_actions/criar-categoria'
import { editarCategoria } from '../_actions/editar-categoria'

interface CategoriaFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    color: string | null
    description: string | null
  }
}

export function CategoriaForm({ initialData }: CategoriaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      if (initialData?.id) {
        formData.append('id', initialData.id)
        await editarCategoria(formData)
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await criarCategoria(formData)
        toast.success('Categoria criada com sucesso!')
      }

      router.push('/dashboard-author/categorias')
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar categoria',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
        >
          Nome da Categoria
        </Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={initialData?.name}
          placeholder="Ex: Cultura"
          className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.95rem] focus:border-narrativa-preto"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="slug"
          className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
        >
          Slug (opcional)
        </Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={initialData?.slug}
          placeholder="gerado a partir do nome — ex: cultura"
          className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto"
        />
        <p className="text-[0.7rem] text-black/40 font-light">
          Usado nos links do site (/?category=slug). Se vazio, é gerado do nome.
          Alterar o slug muda os links públicos desta categoria.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="color"
          className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
        >
          Cor (opcional)
        </Label>
        <Input
          id="color"
          name="color"
          defaultValue={initialData?.color || ''}
          placeholder="#b11226"
          maxLength={7}
          className="rounded-none border-narrativa-cinza-linha px-4 py-5 text-[0.9rem] focus:border-narrativa-preto"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-[0.7rem] tracking-[0.12em] uppercase font-bold text-narrativa-cinza-texto"
        >
          Descrição (opcional)
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ''}
          placeholder="Breve descrição da categoria..."
          className="rounded-none border-narrativa-cinza-linha px-4 py-3 text-[0.95rem] min-h-[100px] resize-none focus:border-narrativa-preto"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-none bg-narrativa-preto hover:bg-narrativa-vermelho text-narrativa-branco text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6 transition-colors"
        >
          {loading
            ? 'Salvando...'
            : initialData?.id
              ? 'Atualizar Categoria'
              : 'Salvar Categoria'}
        </Button>
        <Button
          type="button"
          asChild
          variant="outline"
          className="rounded-none border-narrativa-cinza-linha text-narrativa-cinza-texto text-[0.72rem] font-bold tracking-[0.14em] uppercase py-6"
        >
          <Link href="/dashboard-author/categorias">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}
