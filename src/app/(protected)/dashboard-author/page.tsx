import { ArrowUpRight, BookOpen, CheckCircle2, Clock, Plus, Eye, TrendingUp } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { auth } from '@/lib/auth'
import {
  getDashboardStats,
  getRecentArticles,
  getTopArticles,
} from './_data-access/get-dashboard-stats'

export default async function DashboardAuthorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  const stats = await getDashboardStats()
  const myRecentArticles = await getRecentArticles()
  const topArticles = await getTopArticles()

  return (
    <div className="space-y-12">
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
        <Button
          asChild
          className="rounded-none bg-narrativa-preto text-[0.7rem] font-bold tracking-[0.15em] uppercase h-11 px-6"
        >
          <Link href="/dashboard-author/artigo/new">
            <Plus className="w-4 h-4 mr-2" /> Começar Novo Post
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-none border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-[0.6rem] font-black tracking-widest uppercase text-black/30 mb-2">
              Total Produzido
            </p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black">{stats?.total || 0}</span>
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
                {stats?.published || 0}
              </span>
              <CheckCircle2 className="w-5 h-5 text-green-600/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-none shadow-sm bg-narrativa-vermelho/5">
          <CardContent className="p-6">
            <p className="text-[0.6rem] font-black tracking-widest uppercase text-narrativa-vermelho/60 mb-2">
              Alcance Total
            </p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-narrativa-vermelho">
                {stats?.totalViews?.toLocaleString('pt-BR') || 0}
              </span>
              <Eye className="w-5 h-5 text-narrativa-vermelho/30" />
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
                {stats?.draft || 0}
              </span>
              <Clock className="w-5 h-5 text-narrativa-dourado/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-black/5 pb-4">
            <TrendingUp className="w-4 h-4 text-narrativa-vermelho" />
            <h4 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-black/40">
              Melhor Performance
            </h4>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {topArticles.length > 0 ? (
                topArticles.map((article, index) => (
                  <div 
                    key={article.id} 
                    className="flex items-center gap-4 group cursor-pointer mb-4 last:mb-0"
                  >
                    <span className="text-[1.5rem] font-serif italic text-black/10 group-hover:text-narrativa-vermelho transition-colors w-8">
                      0{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard-author/artigo/edit/${article.id}`}>
                        <h5 className="text-[0.95rem] font-bold text-narrativa-preto line-clamp-1 group-hover:text-narrativa-vermelho transition-colors">
                          {article.title}
                        </h5>
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[0.65rem] text-black/30 font-bold uppercase">
                          {article.category?.name || 'Geral'}
                        </span>
                        <span className="text-black/10">•</span>
                        <span className="text-[0.65rem] text-narrativa-vermelho font-black flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {article.views} acessos
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[0.8rem] text-black/30 italic">Nenhum dado de performance disponível ainda.</p>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-black/5 pb-4">
            <Clock className="w-4 h-4 text-black/40" />
            <h4 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-black/40">
              Atividade Recente
            </h4>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {myRecentArticles.length > 0 ? (
                myRecentArticles.map((article) => (
                  <Link 
                    href={`/dashboard-author/artigo/edit/${article.id}`} 
                    key={article.id}
                    className="block p-4 border border-black/5 hover:border-narrativa-vermelho/20 hover:bg-black/[0.01] transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h5 className="text-[0.9rem] font-black text-narrativa-preto group-hover:text-narrativa-vermelho transition-colors">
                          {article.title}
                        </h5>
                        <div className="flex items-center gap-3">
                          <span className="text-[0.6rem] text-black/30 font-bold uppercase tracking-widest">
                            {new Date(article.updatedAt).toLocaleDateString('pt-BR')}
                          </span>
                          {article.status === 'published' ? (
                            <Badge className="bg-green-600/10 text-green-600 border-none rounded-none text-[0.5rem] font-black uppercase tracking-tighter h-4">
                              Publicado
                            </Badge>
                          ) : (
                            <Badge className="bg-narrativa-dourado/10 text-narrativa-dourado border-none rounded-none text-[0.5rem] font-black uppercase tracking-tighter h-4">
                              Rascunho
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-black/10 group-hover:text-narrativa-vermelho transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-[0.8rem] text-black/30 italic">Sem atividades recentes.</p>
              )}
            </div>
          </ScrollArea>
      </div>
    </div>
  )
}
