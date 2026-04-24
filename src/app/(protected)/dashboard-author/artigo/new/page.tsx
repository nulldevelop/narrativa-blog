import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ArticleForm } from '../_components/ArticleForm'
import { getCategories } from '../_data-access'

export default async function NewArticlePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Header Minimalista de Redação */}
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
              Nova Redação{' '}
              <span className="text-narrativa-vermelho ml-1">·</span> Mesa
              Editorial
            </h1>
          </div>

          <div className="text-[0.6rem] font-bold text-black/20 uppercase tracking-widest max-sm:hidden">
            O que não é dito também é narrativa
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 pt-12">
        <ArticleForm categories={categories} />
      </main>
    </div>
  )
}
