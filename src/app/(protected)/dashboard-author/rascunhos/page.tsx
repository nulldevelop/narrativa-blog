import {
  Clock,
  Edit3,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { auth } from '@/lib/auth'
import { getDraftsByAuthor } from './_data-access/get-drafts-by-author'

export default async function AuthorDraftsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  const articles = await getDraftsByAuthor()

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-black/10 pb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
            Meus{' '}
            <em className="italic text-narrativa-vermelho font-serif">
              Rascunhos
            </em>
          </h2>
          <p className="text-[0.9rem] text-black/40 font-light">
            Continue trabalhando em seus textos ainda não publicados.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
            <Input
              placeholder="Pesquisar em rascunhos..."
              className="rounded-none border-black/10 pl-10 h-11 text-sm"
            />
          </div>
          <Button
            asChild
            className="rounded-none bg-narrativa-preto text-[0.7rem] font-bold tracking-[0.15em] uppercase h-11 px-6"
          >
            <Link href="/dashboard-author/artigo/new">
              <Plus className="w-4 h-4 mr-2" /> Nova Matéria
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
        <ScrollArea className="h-[600px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/2 border-b border-black/5 sticky top-0 z-10">
                  <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 bg-white">
                    Título da Peça
                  </th>
                  <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 bg-white">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 bg-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 bg-white">
                    Última Edição
                  </th>
                  <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 text-right bg-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-black/[0.01] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard-author/artigo/edit/${article.id}`}
                          className="block"
                        >
                          <p className="text-[0.95rem] font-bold text-narrativa-preto group-hover:text-narrativa-vermelho transition-colors">
                            {article.title}
                          </p>
                          <p className="text-[0.7rem] text-black/30 font-medium line-clamp-1 mt-0.5 italic">
                            {article.subtitle || 'Sem subtítulo definido'}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className="rounded-none text-[0.6rem] font-bold uppercase tracking-widest border-black/10 bg-black/[0.02]"
                        >
                          {article.category?.name || 'Geral'}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-1.5 text-narrativa-dourado text-[0.65rem] font-black uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" />
                          Rascunho
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[0.75rem] text-black/40 font-medium">
                          {new Date(article.updatedAt).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-black/5"
                            >
                              <MoreHorizontal className="w-4 h-4 text-black/30" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-none border-black/10 w-48"
                          >
                            <DropdownMenuLabel className="text-[0.6rem] font-black tracking-widest uppercase text-black/40">
                              Opções
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link
                                href={`/dashboard-author/artigo/edit/${article.id}`}
                                className="flex items-center"
                              >
                                <Edit3 className="w-4 h-4 mr-3 text-black/40" />
                                Editar Texto
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link
                                href={`/dashboard-author/artigo/preview/${article.id}`}
                                className="flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-3 text-black/40" />
                                Visualizar
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <FileText className="w-12 h-12 text-black/5 mx-auto mb-4" />
                      <p className="text-[0.9rem] text-black/40 italic font-serif max-w-xs mx-auto">
                        Você não possui rascunhos no momento.
                      </p>
                      <Button
                        asChild
                        variant="link"
                        className="text-narrativa-vermelho text-[0.7rem] font-black uppercase tracking-widest mt-4"
                      >
                        <Link href="/dashboard-author/artigo/new">
                          Criar nova matéria
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
