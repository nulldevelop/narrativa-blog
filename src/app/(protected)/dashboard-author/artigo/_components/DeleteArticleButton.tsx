'use client'

import { Trash2 } from 'lucide-react'
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
import { deleteArticleAction } from '../_actions/delete-article'

interface DeleteArticleButtonProps {
  articleId: string
  articleTitle: string
}

export function DeleteArticleButton({
  articleId,
  articleTitle,
}: DeleteArticleButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteArticleAction(articleId)

      if (result.success) {
        toast.success('Matéria excluída com sucesso!')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao excluir a matéria.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
        className="cursor-pointer"
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4 mr-3" />
        {isDeleting ? 'Excluindo...' : 'Excluir Matéria'}
      </DropdownMenuItem>
      <AlertDialogContent className="rounded-none border-black/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-black text-narrativa-preto uppercase tracking-tight">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black/60 font-medium">
            Você tem certeza que deseja excluir permanentemente a matéria{' '}
            <strong className="text-narrativa-preto">"{articleTitle}"</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none border-black/10 font-bold uppercase text-[0.7rem] tracking-widest">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className="rounded-none bg-red-600 hover:bg-red-700 font-bold uppercase text-[0.7rem] tracking-widest"
          >
            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
