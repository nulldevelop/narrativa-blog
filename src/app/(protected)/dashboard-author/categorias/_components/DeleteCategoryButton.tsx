'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { removerCategoria } from '../_actions/remover-categoria'

export function DeleteCategoryButton({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Remover a categoria "${name}"?`)) return

    startTransition(async () => {
      const res = await removerCategoria(id)
      if (res.success) {
        toast.success('Categoria removida com sucesso!')
        router.refresh()
      } else {
        toast.error(res.error || 'Erro ao remover categoria')
      }
    })
  }

  return (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
