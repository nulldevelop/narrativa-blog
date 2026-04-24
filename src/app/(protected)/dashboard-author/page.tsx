import { ArrowUpRight, BookOpen, CheckCircle2, Clock, Plus } from 'lucide-react'
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
    <div className="space-y-8">
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
              <BookOpen className="w-10 h-10 text-black/10 mx-auto mb-4" />
              <p className="text-[0.9rem] text-black/40 italic font-serif max-w-[300px] mx-auto">
                Você ainda não iniciou sua jornada na Narrativa. Comece seu
                primeiro texto hoje.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}