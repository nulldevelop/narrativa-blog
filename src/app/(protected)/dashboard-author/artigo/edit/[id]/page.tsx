import { getArticleById } from "../../_data-access/get-article-by-id";
import { getCategories } from "../../_data-access/get-categories";
import { getArticleImages } from "../../_data-access/get-article-images";
import { ArticleForm } from "../../_components/ArticleForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, categories, images] = await Promise.all([
    getArticleById(id),
    getCategories(),
    getArticleImages(id),
  ]);

  if (!article) {
    return notFound();
  }

  // Preparar dados para o formulário
  const initialData = {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    content: article.content,
    categoryId: article.categoryId,
    coverImage: article.coverImage,
    tags: article.tags.map((t) => t.tag.name),
    status: article.status,
    images: images,
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Header Minimalista de Redação */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard-author/artigo" 
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-black/40" />
            </Link>
            <h1 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-black/60">
              Editando Matéria <span className="text-narrativa-vermelho ml-1">·</span> Mesa Editorial
            </h1>
          </div>
          
          <div className="text-[0.6rem] font-bold text-black/20 uppercase tracking-widest max-sm:hidden">
            Versão original: {new Date(article.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 pt-12">
        <ArticleForm categories={categories} initialData={initialData} />
      </main>
    </div>
  );
}
