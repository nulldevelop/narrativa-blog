import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Plus, 
  ChevronLeft, 
  Search, 
  Edit3, 
  Eye, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AuthorArticlesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Busca todos os artigos do autor logado
  const articles = await prisma.article.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Header Editorial de Gestão */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard-author" 
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-black/40" />
            </Link>
            <h1 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-black/60">
              Minhas Matérias <span className="text-narrativa-vermelho ml-1">·</span> Acervo Pessoal
            </h1>
          </div>
          
          <Button asChild className="rounded-none bg-narrativa-preto h-9 px-4 text-[0.65rem] font-bold tracking-widest uppercase">
            <Link href="/dashboard-author/artigo/new">
              <Plus className="w-3.5 h-3.5 mr-2" /> Nova Matéria
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 pt-12">
        <div className="flex flex-col gap-8">
          
          {/* Título e Filtro Simples */}
          <div className="flex items-end justify-between flex-wrap gap-4 border-b border-black/10 pb-6">
            <div>
              <h2 className="font-heading text-[2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
                Minha <em className="italic text-narrativa-vermelho font-serif">Produção</em>
              </h2>
              <p className="text-[0.85rem] text-black/40 font-light">Gerencie seus rascunhos e matérias publicadas.</p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
              <Input 
                placeholder="Pesquisar em meus textos..." 
                className="rounded-none border-black/10 pl-10 h-10 text-sm"
              />
            </div>
          </div>

          {/* Listagem de Artigos */}
          <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/[0.02] border-b border-black/5">
                    <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">Título da Peça</th>
                    <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">Categoria</th>
                    <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">Status</th>
                    <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40">Última Edição</th>
                    <th className="px-6 py-4 text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/40 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <tr key={article.id} className="hover:bg-black/[0.01] transition-colors group">
                        <td className="px-6 py-5">
                          <Link href={`/dashboard-author/artigo/edit/${article.id}`} className="block">
                            <p className="text-[0.95rem] font-bold text-narrativa-preto group-hover:text-narrativa-vermelho transition-colors">
                              {article.title}
                            </p>
                            <p className="text-[0.7rem] text-black/30 font-medium line-clamp-1 mt-0.5 italic">
                              {article.subtitle || "Sem subtítulo definido"}
                            </p>
                          </Link>
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant="outline" className="rounded-none text-[0.6rem] font-bold uppercase tracking-widest border-black/10 bg-black/[0.02]">
                            {article.category?.name || "Geral"}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          {article.status === "published" ? (
                            <span className="flex items-center gap-1.5 text-green-600 text-[0.65rem] font-black uppercase tracking-widest">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-narrativa-dourado text-[0.65rem] font-black uppercase tracking-widest">
                              <Clock className="w-3.5 h-3.5" /> Rascunho
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[0.75rem] text-black/40 font-medium">
                            {new Date(article.updatedAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5">
                                <MoreHorizontal className="w-4 h-4 text-black/30" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-none border-black/10 w-48">
                              <DropdownMenuLabel className="text-[0.6rem] font-black tracking-widest uppercase text-black/40">Opções</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/dashboard-author/artigo/edit/${article.id}`} className="flex items-center">
                                  <Edit3 className="w-4 h-4 mr-3 text-black/40" /> Editar Texto
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/artigo/${article.slug}`} className="flex items-center">
                                  <Eye className="w-4 h-4 mr-3 text-black/40" /> Ver no Site
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                Arquivar Matéria
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
                          Seu acervo ainda está vazio. Comece a documentar suas narrativas.
                        </p>
                        <Button asChild variant="link" className="text-narrativa-vermelho text-[0.7rem] font-black uppercase tracking-widest mt-4">
                          <Link href="/dashboard-author/artigo/new">Criar primeira matéria</Link>
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto px-8 py-10 text-center">
         <p className="text-[0.6rem] tracking-[0.2em] uppercase text-black/20 font-bold">
           Narrativa Mesa Editorial · Gestão de Conteúdo Autorizado
         </p>
      </footer>
    </div>
  );
}
