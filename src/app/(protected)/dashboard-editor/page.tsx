import Link from "next/link";
import { 
  FileText, 
  Tags, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardEditorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Estatísticas Editoriais
  const [totalArticles, publishedArticles, draftArticles, categoriesCount] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.category.count()
  ]);

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { author: true, category: true }
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      {/* Header Superior */}
      <header className="bg-narrativa-preto border-b-[3px] border-narrativa-vermelho sticky top-0 z-50">
        <div className="flex items-center justify-between px-8 py-4 max-w-[1600px] mx-auto w-full">
          <Link href="/" className="flex flex-col gap-0.5 leading-none">
            <span className="font-heading text-[1.4rem] font-black tracking-[0.05em] text-narrativa-branco uppercase">
              NARRATIVA<span className="text-narrativa-vermelho">.</span>
            </span>
            <span className="text-[0.55rem] tracking-[0.2em] uppercase text-white/40 font-light">
              Mesa de Edição · Fluxo de Conteúdo
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end max-md:hidden">
              <span className="text-[0.75rem] font-bold text-white uppercase tracking-wider">{session.user.name}</span>
              <span className="text-[0.6rem] text-narrativa-vermelho font-black uppercase tracking-widest">EDITOR CHEFE</span>
            </div>
            <Link href="/api/auth/sign-out">
              <Button variant="ghost" size="icon" className="text-white hover:text-narrativa-vermelho transition-colors">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-8 gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
           <p className="text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/30 mb-2 px-3">Produção</p>
           <nav className="space-y-1">
             <Link href="/dashboard-editor" className="flex items-center gap-3 px-3 py-2.5 bg-narrativa-preto text-white font-bold text-[0.8rem] uppercase tracking-wider">
               <LayoutDashboard className="w-4 h-4" /> Editorial
             </Link>
             <Link href="/dashboard-editor/materias" className="flex items-center gap-3 px-3 py-2.5 text-black/60 hover:bg-black/5 font-bold text-[0.8rem] uppercase tracking-wider transition-all">
               <FileText className="w-4 h-4" /> Todas as Matérias
             </Link>
             <Link href="/dashboard-editor/categorias" className="flex items-center gap-3 px-3 py-2.5 text-black/60 hover:bg-black/5 font-bold text-[0.8rem] uppercase tracking-wider transition-all">
               <Tags className="w-4 h-4" /> Categorias & Tags
             </Link>
           </nav>

           <div className="mt-8 pt-6 border-t border-black/5">
             <Link href="/" className="flex items-center gap-3 px-3 py-2 text-narrativa-vermelho font-bold text-[0.7rem] uppercase tracking-[0.15em] hover:translate-x-1 transition-transform">
               <Globe className="w-4 h-4" /> Ver Site Público
             </Link>
           </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 space-y-8">
          
          <div className="flex items-end justify-between border-b border-black/10 pb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
                Painel <em className="italic text-narrativa-vermelho font-serif">Editorial</em>
              </h2>
              <p className="text-[0.9rem] text-black/40 font-light">Organização e supervisão da produção política.</p>
            </div>
            <Button className="rounded-none bg-narrativa-preto text-[0.7rem] font-bold tracking-[0.15em] uppercase h-11 px-6">
              <Plus className="w-4 h-4 mr-2" /> Escrever Matéria
            </Button>
          </div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-none border-none shadow-sm">
               <CardContent className="p-5">
                  <p className="text-[0.6rem] font-black tracking-widest uppercase text-black/30 mb-1">Total de Peças</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black">{totalArticles}</span>
                    <FileText className="w-3.5 h-3.5 text-black/20" />
                  </div>
               </CardContent>
            </Card>
            <Card className="rounded-none border-none shadow-sm">
               <CardContent className="p-5">
                  <p className="text-[0.6rem] font-black tracking-widest uppercase text-green-600/60 mb-1">Publicadas</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-green-600">{publishedArticles}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600/40" />
                  </div>
               </CardContent>
            </Card>
            <Card className="rounded-none border-none shadow-sm">
               <CardContent className="p-5">
                  <p className="text-[0.6rem] font-black tracking-widest uppercase text-narrativa-dourado/60 mb-1">Em Rascunho</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-narrativa-dourado">{draftArticles}</span>
                    <Clock className="w-3.5 h-3.5 text-narrativa-dourado/40" />
                  </div>
               </CardContent>
            </Card>
            <Card className="rounded-none border-none shadow-sm">
               <CardContent className="p-5">
                  <p className="text-[0.6rem] font-black tracking-widest uppercase text-blue-600/60 mb-1">Categorias</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-blue-600">{categoriesCount}</span>
                    <Tags className="w-3.5 h-3.5 text-blue-600/40" />
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Lista de Matérias Recentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-black/40">Últimas Atualizações</h4>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
                <Input placeholder="Buscar matéria..." className="pl-9 h-9 rounded-none border-black/5 text-[0.75rem]" />
              </div>
            </div>

            <Card className="rounded-none border-none shadow-sm overflow-hidden">
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/[0.02] border-b border-black/5">
                          <th className="px-6 py-4 text-[0.65rem] font-black tracking-widest uppercase text-black/40">Título da Matéria</th>
                          <th className="px-6 py-4 text-[0.65rem] font-black tracking-widest uppercase text-black/40">Autor</th>
                          <th className="px-6 py-4 text-[0.65rem] font-black tracking-widest uppercase text-black/40">Categoria</th>
                          <th className="px-6 py-4 text-[0.65rem] font-black tracking-widest uppercase text-black/40">Status</th>
                          <th className="px-6 py-4 text-[0.65rem] font-black tracking-widest uppercase text-black/40"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {recentArticles.length > 0 ? (
                          recentArticles.map((article) => (
                            <tr key={article.id} className="hover:bg-black/[0.01] transition-colors group">
                              <td className="px-6 py-4">
                                <p className="text-[0.85rem] font-bold text-narrativa-preto line-clamp-1">{article.title}</p>
                                <p className="text-[0.65rem] text-black/30 uppercase font-bold mt-0.5">
                                  Atualizado {new Date(article.updatedAt).toLocaleDateString('pt-BR')}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-narrativa-vermelho flex items-center justify-center text-[0.6rem] font-bold text-white uppercase">
                                    {article.author.name.charAt(0)}
                                  </div>
                                  <span className="text-[0.75rem] text-black/60">{article.author.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className="rounded-none text-[0.6rem] font-bold uppercase tracking-widest border-black/10">
                                  {article.category?.name || 'Sem Categoria'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                {article.status === 'published' ? (
                                  <span className="flex items-center gap-1.5 text-green-600 text-[0.65rem] font-black uppercase tracking-widest">
                                    <CheckCircle2 className="w-3 h-3" /> Publicado
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-narrativa-dourado text-[0.65rem] font-black uppercase tracking-widest">
                                    <Clock className="w-3 h-3" /> Rascunho
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" className="group-hover:text-narrativa-vermelho transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                               <AlertCircle className="w-8 h-8 text-black/10 mx-auto mb-3" />
                               <p className="text-[0.85rem] text-black/40 italic font-serif">Nenhuma matéria produzida ainda.</p>
                               <Button variant="link" className="text-narrativa-vermelho text-[0.7rem] font-black uppercase tracking-widest mt-2">
                                 Começar primeira redação
                               </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </CardContent>
            </Card>
          </div>

        </main>
      </div>

      <footer className="p-8 border-t border-black/5 text-center mt-auto">
         <p className="text-[0.65rem] tracking-[0.15em] uppercase text-black/20 font-bold">
           Mesa Editorial Narrativa · 2026 · A política como ela é
         </p>
      </footer>
    </div>
  );
}
