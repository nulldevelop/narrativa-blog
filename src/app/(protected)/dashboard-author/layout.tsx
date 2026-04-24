import {
  Clock,
  Globe,
  LayoutDashboard,
  LogOut,
  PenTool,
  Zap,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardAuthorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  const userMember = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  const orgName = userMember?.organization?.name || 'Narrativa — Geral'

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <header className="bg-narrativa-preto border-b-[3px] border-narrativa-vermelho sticky top-0 z-50">
        <div className="flex items-center justify-between px-8 py-4 max-w-400 mx-auto w-full">
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

      <div className="flex-1 flex flex-col lg:flex-row max-w-400 mx-auto w-full p-8 gap-8">
        {/* Sidebar Persistente */}
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
            <Link
              href="/dashboard-author/curtas"
              className="flex items-center gap-3 px-3 py-2.5 text-black/60 hover:bg-black/5 font-bold text-[0.8rem] uppercase tracking-wider transition-all"
            >
              <Zap className="w-4 h-4" /> Curtas
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

        {/* Conteúdo das Páginas */}
        <main className="flex-1">{children}</main>
      </div>

      <footer className="p-8 border-t border-black/5 text-center mt-auto">
        <p className="text-[0.65rem] tracking-[0.15em] uppercase text-black/20 font-bold">
          Painel de Autor Narrativa · 2026 · A política passa pela sua voz
        </p>
      </footer>
    </div>
  )
}
