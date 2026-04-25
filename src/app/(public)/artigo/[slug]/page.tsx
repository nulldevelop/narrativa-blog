import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FadeUp } from '@/components/fade-up'
import { NewsletterWidget } from '@/components/newsletter-widget'
import { ReadingProgress } from '@/components/reading-progress'
import { getArticleBySlug } from '../../_data-access/get-article-by-slug'

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await getArticleBySlug(slug)

  if (!article) return notFound()

  return (
    <>
      <ReadingProgress />

      {/* Hero / Cabeçalho Escuro */}
      <header className="bg-narrativa-preto px-[clamp(1.5rem,5vw,4rem)] py-[3rem] lg:py-[4rem]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[3rem] items-center">
          {/* Coluna Esquerda: Conteúdo */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="text-[0.65rem] tracking-[0.2em] uppercase text-narrativa-vermelho font-bold"
              >
                ← Voltar
              </Link>
            </div>

            <FadeUp>
              <h1 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-black text-narrativa-branco leading-[1.08] mb-6 tracking-[-0.02em]">
                {article.title}
              </h1>
            </FadeUp>

            {article.subtitle && (
              <FadeUp delay={0.1}>
                <p className="text-[clamp(1rem,1.5vw,1.15rem)] text-white/50 leading-[1.6] font-light max-w-[600px] border-l-2 border-narrativa-vermelho pl-5 italic font-serif">
                  {article.subtitle}
                </p>
              </FadeUp>
            )}

            <FadeUp delay={0.2}>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-narrativa-vermelho flex items-center justify-center text-[0.85rem] font-bold text-narrativa-branco shrink-0 uppercase">
                    {article.author.name.charAt(0)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[0.78rem] font-bold text-narrativa-branco tracking-[0.04em]">
                      {article.author.name}
                    </span>
                    <span className="text-[0.65rem] text-white/35 tracking-[0.08em] uppercase">
                      {new Date(
                        article.publishedAt || article.createdAt,
                      ).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Coluna Direita: Imagem de Capa */}
          <FadeUp delay={0.3} className="w-full">
            <div className="relative w-full h-[250px] lg:h-[380px] overflow-hidden rounded-[8px] bg-narrativa-cinza-claro">
              <Image
                src={
                  article.coverImage ||
                  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop'
                }
                alt={article.title}
                fill
                sizes="(max-width: 1200px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {article.coverImageCredit && (
              <p className="text-[0.6rem] text-white/30 uppercase tracking-widest mt-2 text-right italic font-medium">
                {article.coverImageCredit}
              </p>
            )}
          </FadeUp>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        <div className="py-[clamp(3rem,6vw,5rem)]">
          <div className="grid grid-cols-[1fr_280px] gap-20 items-start max-md:grid-cols-1 w-full overflow-hidden">
            {/* Renderizador de Markdown Profissional */}
            <article className="max-w-[680px] w-full">
              <div
                className="prose prose-lg prose-narrativa w-full max-w-none article-drop-cap break-words
                prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight
                prose-p:text-narrativa-cinza-texto prose-p:leading-[1.85]
                prose-blockquote:border-narrativa-vermelho prose-blockquote:italic
                prose-strong:text-narrativa-preto prose-a:text-narrativa-vermelho
                prose-table:w-full prose-img:w-full prose-pre:w-full"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Sidebar Relacionados */}
            <aside
              className="sticky top-[100px] flex flex-col gap-8 max-md:static"
              aria-label="Conteúdo relacionado"
            >
              <div className="pb-6 border-b border-narrativa-cinza-linha">
                <p className="text-[0.63rem] tracking-[0.2em] uppercase text-narrativa-vermelho font-bold mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-narrativa-cinza-linha">
                  Newsletter
                </p>
                <NewsletterWidget buttonLabel="Assinar" />
              </div>
              <div className="pb-6">
                <p className="text-[0.63rem] tracking-[0.2em] uppercase text-narrativa-vermelho font-bold mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-narrativa-cinza-linha">
                  Sobre
                </p>
                <p className="text-[0.85rem] text-narrativa-cinza-texto leading-[1.65]">
                  Narrativa é um blog de matéria política com foco no que está
                  por trás do discurso público.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
