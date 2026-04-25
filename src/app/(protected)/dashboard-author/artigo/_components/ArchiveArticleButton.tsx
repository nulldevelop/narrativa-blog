'use client'

import { Archive } from 'lucide-react'
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
import { archiveArticleAction } from '../_actions/archive-article'

interface ArchiveArticleButtonProps {
  articleId: string
  articleTitle: string
}

export function ArchiveArticleButton({
  articleId,
  articleTitle,
}: ArchiveArticleButtonProps) {
  const [isArchiving, setIsArchiving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleArchive = async () => {
    try {
      setIsArchiving(true)
      const result = await archiveArticleAction(articleId)

      if (result.success) {
        toast.success('Matéria arquivada com sucesso!')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao arquivar a matéria.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.')
    } finally {
      setIsArchiving(false)
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
        className="cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50"
        disabled={isArchiving}
      >
        <Archive className="w-4 h-4 mr-3" />
        {isArchiving ? 'Arquivando...' : 'Arquivar Matéria'}
      </DropdownMenuItem>
      <AlertDialogContent className="rounded-none border-black/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading font-black text-narrativa-preto uppercase tracking-tight">
            Confirmar Arquivamento
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black/60 font-medium">
            Você tem certeza que deseja arquivar a matéria{' '}
            <strong className="text-narrativa-preto">"{articleTitle}"</strong>?
            Ela deixará de aparecer no site público, mas continuará salva em seu acervo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none border-black/10 font-bold uppercase text-[0.7rem] tracking-widest">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleArchive()
            }}
            className="rounded-none bg-amber-600 hover:bg-amber-700 font-bold uppercase text-[0.7rem] tracking-widest"
          >
            {isArchiving ? 'Arquivando...' : 'Sim, Arquivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
