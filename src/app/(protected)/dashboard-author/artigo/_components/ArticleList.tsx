'use client'

import {
  Archive,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileText,
  MoreHorizontal,
} from 'lucide-react'
import Link from 'next/link'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArchiveArticleButton } from './ArchiveArticleButton'
import { UnarchiveArticleButton } from './UnarchiveArticleButton'

interface Article {
  id: string
  title: string
  slug: string
  subtitle: string | null
  status: string
  updatedAt: Date
  category: { name: string } | null
}

interface ArticleListProps {
  articles: Article[]
}

export function ArticleList({ articles }: ArticleListProps) {
  const activeArticles = articles.filter((a) => a.status !== 'archived')
  const archivedArticles = articles.filter((a) => a.status === 'archived')

  const renderTable = (items: Article[], emptyMessage: string) => (
    <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/[0.02] border-b border-black/5">
              <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">
                Título da Peça
              </th>
              <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">
                Categoria
              </th>
              <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">
                Status
              </th>
              <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">
                Última Edição
              </th>
              <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.length > 0 ? (
              items.map((article) => (
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
                    {article.status === 'published' ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-[0.65rem] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" />Publicado
                      </span>
                    ) : article.status === 'archived' ? (
                      <span className="flex items-center gap-1.5 text-black/40 text-[0.65rem] font-black uppercase tracking-widest">
                        <Archive className="w-3.5 h-3.5" />Arquivado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-narrativa-dourado text-[0.65rem] font-black uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[0.75rem] text-black/40 font-medium">
                      {new Date(article.updatedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
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
                            href={`/artigo/${article.slug}`}
                            className="flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-3 text-black/40" />
                            Ver no Site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {article.status === 'archived' ? (
                          <UnarchiveArticleButton
                            articleId={article.id}
                            articleTitle={article.title}
                          />
                        ) : (
                          <ArchiveArticleButton
                            articleId={article.id}
                            articleTitle={article.title}
                          />
                        )}
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
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="bg-transparent border-b border-black/5 w-full justify-start rounded-none h-auto p-0 mb-6 gap-8">
        <TabsTrigger
          value="active"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-narrativa-vermelho data-[state=active]:bg-transparent text-[0.7rem] font-black uppercase tracking-widest pb-4 px-0"
        >
          Ativas ({activeArticles.length})
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-narrativa-vermelho data-[state=active]:bg-transparent text-[0.7rem] font-black uppercase tracking-widest pb-4 px-0"
        >
          Arquivadas ({archivedArticles.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-0 outline-none">
        {renderTable(
          activeArticles,
          'Seu acervo ativo está vazio. Comece a documentar suas narrativas.',
        )}
      </TabsContent>

      <TabsContent value="archived" className="mt-0 outline-none">
        {renderTable(archivedArticles, 'Nenhuma matéria arquivada encontrada.')}
      </TabsContent>
    </Tabs>
  )
}
