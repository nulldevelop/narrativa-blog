'use client'

import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Article, ArticleList } from './ArticleList'

interface ArticleManagerProps {
  articles: Article[]
}

export function ArticleManager({ articles }: ArticleManagerProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-black/10 pb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-[2.2rem] font-black text-narrativa-preto tracking-tight leading-none mb-2">
            Minha{' '}
            <em className="italic text-narrativa-vermelho font-serif">
              Produção
            </em>
          </h2>
          <p className="text-[0.9rem] text-black/40 font-light">
            Gerencie seus rascunhos, matérias publicadas e arquivadas.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar em meus textos..."
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

      <ArticleList articles={articles} searchQuery={search} />
    </div>
  )
}
