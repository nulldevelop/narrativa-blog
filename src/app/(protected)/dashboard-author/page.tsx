import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  LayoutDashboard,
  LogOut,
  PenTool,
  Plus,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardAuthorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  // Buscar Organização do Usuário
  const userMember = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  const orgName = userMember?.organization?.name || 'Narrativa — Geral'

  // Estatísticas do Autor Específico
  const [myTotalArticles, myPublishedArticles, myDraftArticles] =
    await Promise.all([
      prisma.article.count({ where: { authorId: session.user.id } }),
      prisma.article.count({
        where: { authorId: session.user.id, status: 'published' },
      }),
      prisma.article.count({
        where: { authorId: session.user.id, status: 'draft' },
      }),
    ])

  const myRecentArticles = await prisma.article.findMany({
    where: { authorId: session.user.id },
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })

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
              {orgName} · Perspectiva e Versão
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end max-md:hidden">
              <span className="text-[0.75rem] font-bold text-white uppercase tracking-wider">
                {session.user.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[0.5rem] text-white/40 font-bold uppercase tracking-widest border border-white/10 px-1.5 py-0.5">
                   {userMember?.organization?.slug || 'geral'}
                </span>
                <span className="text-[0.6rem] text-narrativa-vermelho font-black uppercase tracking-widest">
                  AUTOR
                </span>
              </div>
            </div>
            <Link href="/api/auth/sign-out">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-narrativa-vermelho transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-8 gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <p className="text-[0.6rem] font-black tracking-[0.2em] uppercase text-black/30 mb-2 px-3">
            Escrita
          </p>
          <nav className="space-y-1">
            <Link
              href="/dashboard-author"
              className="flex items-center gap-3 px-3 py-2.5 bg-narrativa-preto text-white font-bold text-[0.8rem] uppercase tracking-wider"
            >
              <LayoutDashboard className="w-4 h-4" /> Visão Geral
            </Link>
            <Link
              href="/dashboard-author/artigo"
              className="flex items-center gap-3 px-3 py-2.5 text-black/60 hover:bg-black/5 font-bold text-[0.8rem] uppercase tracking-wider transition-all"
            >
              <PenTool className="w-4 h-4" /> Meus Artigos
            </Link>
            <Link
              href="/dashboard-author/rascunhos"
              className="flex items-center gap-3 px-3 py-2.5 text-black/60 hover:bg-black/5 font-bold text-[0.8rem] uppercase tracking-wider transition-all"
            >
              <Clock className="w-4 h-4" /> Rascunhos
            </Link>
          </nav>

          <div className="mt-8 pt-6 border-t border-black/5">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-narrativa-vermelho font-bold text-[0.7rem] uppercase tracking-[0.15em] hover:translate-x-1 transition-transform"
            >
              <Globe className="w-4 h-4" /> Ver Site Público
            </Link>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 space-y-8">
          <div className="flex items-end justify-between border-b border-black/10 pb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
                Minha{' '}
                <em className="italic text-narrativa-vermelho font-serif">
                  Escrita
                </em>
              </h2>
              <p className="text-[0.9rem] text-black/40 font-light">
                Seu fluxo de produção e impacto editorial.
              </p>
            </div>
            <Button asChild className="rounded-none bg-narrativa-preto text-[0.7rem] font-bold tracking-[0.15em] uppercase h-11 px-6">
              <Link href="/dashboard-author/artigo/new">
                <Plus className="w-4 h-4 mr-2" /> Começar Novo Post
              </Link>
            </Button>
          </div>

          {/* Grid de Métricas Pessoais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="rounded-none border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-[0.6rem] font-black tracking-widest uppercase text-black/30 mb-2">
                  Total Produzido
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black">{myTotalArticles}</span>
                  <BookOpen className="w-5 h-5 text-black/10" />
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-[0.6rem] font-black tracking-widest uppercase text-green-600/60 mb-2">
                  Publicados
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-green-600">
                    {myPublishedArticles}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-green-600/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-[0.6rem] font-black tracking-widest uppercase text-narrativa-dourado/60 mb-2">
                  Em Rascunho
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-narrativa-dourado">
                    {myDraftArticles}
                  </span>
                  <Clock className="w-5 h-5 text-narrativa-dourado/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Minhas Matérias Recentes */}
          <div className="space-y-6">
            <h4 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-black/40">
              Últimos Textos
            </h4>

            <div className="grid gap-4">
              {myRecentArticles.length > 0 ? (
                myRecentArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="rounded-none border-none shadow-sm hover:shadow-md transition-all group"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant="outline"
                              className="rounded-none text-[0.6rem] font-bold uppercase tracking-widest border-black/10"
                            >
                              {article.category?.name || 'Sem Categoria'}
                            </Badge>
                            <span className="text-[0.65rem] text-black/30 font-bold uppercase tracking-wider">
                              {new Date(article.updatedAt).toLocaleDateString(
                                'pt-BR',
                              )}
                            </span>
                          </div>
                          <h5 className="text-[1.1rem] font-black text-narrativa-preto group-hover:text-narrativa-vermelho transition-colors">
                            {article.title}
                          </h5>
                        </div>
                        <div className="flex items-center gap-6 ml-8">
                          <div className="text-right hidden sm:block">
                            {article.status === 'published' ? (
                              <span className="text-green-600 text-[0.65rem] font-black uppercase tracking-widest">
                                Publicado
                              </span>
                            ) : (
                              <span className="text-narrativa-dourado text-[0.65rem] font-black uppercase tracking-widest">
                                Rascunho
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group-hover:bg-narrativa-vermelho group-hover:text-white transition-all"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-black/5">
                  <PenTool className="w-10 h-10 text-black/10 mx-auto mb-4" />
                  <p className="text-[0.9rem] text-black/40 italic font-serif max-w-[300px] mx-auto">
                    Você ainda não iniciou sua jornada na Narrativa. Comece seu
                    primeiro texto hoje.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="p-8 border-t border-black/5 text-center mt-auto">
        <p className="text-[0.65rem] tracking-[0.15em] uppercase text-black/20 font-bold">
          Painel de Autor Narrativa · 2026 · A política passa pela sua voz
        </p>
      </footer>
    </div>
  )
}
