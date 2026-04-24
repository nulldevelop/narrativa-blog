import { getArticleById } from "../../_data-access/get-article-by-id";
import { getCategories } from "../../_data-access/get-categories";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from "next/image";

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Barra de Controle de Preview */}
      <div className="sticky top-0 z-50 bg-narrativa-preto px-8 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-white/40 text-[0.55rem] font-black uppercase tracking-[0.2em]">Modo de Visualização</span>
            <span className="text-white text-[0.7rem] font-bold uppercase tracking-wider">Preview Editorial</span>
          </div>
          <Badge className="bg-narrativa-vermelho text-white rounded-none text-[0.5rem] uppercase font-black px-2 py-0.5">
            {article.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-none h-10 px-6 text-[0.65rem] font-bold uppercase tracking-widest">
            <Link href={`/dashboard-author/artigo/edit/${article.id}`}>
              <Edit3 className="w-4 h-4 mr-2" /> Voltar ao Editor
            </Link>
          </Button>
        </div>
      </div>

      {/* HEADER DO POST (REPLICADO DO SITE PÚBLICO) */}
      <header className="bg-narrativa-preto px-[clamp(1.5rem,5vw,4rem)] py-[5rem] text-left">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[0.65rem] tracking-[0.25em] uppercase text-narrativa-vermelho font-black">
                Política · {article.categoryId ? "Categoria Selecionada" : "Geral"}
              </span>
            </div>

            <h1 className="font-heading text-[clamp(2.5rem,5vw,3.8rem)] font-black text-narrativa-branco leading-[1.05] mb-8 tracking-[-0.03em]">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-[clamp(1.1rem,1.8vw,1.3rem)] text-white/50 leading-[1.6] font-light max-w-[620px] border-l-3 border-narrativa-vermelho pl-6 italic font-serif">
                {article.subtitle}
              </p>
            )}
          </div>

          <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-[4px] bg-narrativa-cinza-claro shadow-2xl">
            {article.coverImage ? (
              <img src={article.coverImage} alt="Capa" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 italic font-serif">Nenhuma imagem de capa definida</div>
            )}
          </div>
        </div>
      </header>

      {/* CORPO DO POST */}
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-24 text-left">
        <div className="grid grid-cols-[1fr_300px] gap-24 items-start max-md:grid-cols-1">
          <article className="max-w-[720px]">
            <div className="prose prose-xl prose-narrativa max-w-none article-drop-cap">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Sidebar de Preview (Simulada) */}
          <aside className="flex flex-col gap-10">
            <div className="pb-8 border-b border-narrativa-cinza-linha">
               <p className="text-[0.65rem] tracking-[0.2em] uppercase text-narrativa-vermelho font-black mb-6">Informações do Post</p>
               <div className="space-y-4">
                  <div>
                    <span className="block text-[0.55rem] uppercase text-slate-400 font-bold mb-1">Status Editorial</span>
                    <span className="text-[0.75rem] font-bold text-slate-700 uppercase">{article.status}</span>
                  </div>
                  <div>
                    <span className="block text-[0.55rem] uppercase text-slate-400 font-bold mb-1">Última Atualização</span>
                    <span className="text-[0.75rem] font-bold text-slate-700">{new Date(article.updatedAt).toLocaleString('pt-BR')}</span>
                  </div>
               </div>
            </div>
            
            <div className="p-6 bg-slate-50 border border-slate-100">
               <p className="text-[0.7rem] leading-relaxed text-slate-500 italic font-serif">
                 &quot;Este é um modo de visualização segura. Nenhuma alteração feita aqui será salva.&quot;
               </p>
            </div>
          </aside>
        </div>
      </div>

      <footer className="py-16 border-t border-slate-100 text-center">
         <p className="text-[0.6rem] tracking-[0.3em] uppercase text-slate-300 font-black">
           Narrativa · Preview System
         </p>
      </footer>
    </div>
  );
}
