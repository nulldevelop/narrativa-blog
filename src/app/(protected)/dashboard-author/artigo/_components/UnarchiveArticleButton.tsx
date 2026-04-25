'use client'

import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { unarchiveArticleAction } from '../_actions/unarchive-article'

interface UnarchiveArticleButtonProps {
  articleId: string
  articleTitle: string
}

export function UnarchiveArticleButton({
  articleId,
  articleTitle,
}: UnarchiveArticleButtonProps) {
  const [isUnarchiving, setIsUnarchiving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleUnarchive = async () => {
    try {
      setIsUnarchiving(true)
      const result = await unarchiveArticleAction(articleId)

      if (result.success) {
        toast.success('Matéria restaurada para rascunhos!')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao restaurar a matéria.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.')
    } finally {
      setIsUnarchiving(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        variant="default"
        onSelect={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
        className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50"
        disabled={isUnarchiving}
      >
        <RotateCcw className="w-4 h-4 mr-3" />
        {isUnarchiving ? 'Restaurando...' : 'Desarquivar Matéria'}
      </DropdownMenuItem>
      <AlertDialogContent className="rounded-none border-black/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-black text-narrativa-preto uppercase tracking-tight">
            Restaurar Matéria
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black/60 font-medium">
            Deseja restaurar a matéria{' '}
            <strong className="text-narrativa-preto">"{articleTitle}"</strong>?
            Ela voltará para a sua lista de produção como um rascunho.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none border-black/10 font-bold uppercase text-[0.7rem] tracking-widest">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleUnarchive()
            }}
            className="rounded-none bg-green-600 hover:bg-green-700 font-bold uppercase text-[0.7rem] tracking-widest"
          >
            {isUnarchiving ? 'Restaurando...' : 'Sim, Restaurar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
