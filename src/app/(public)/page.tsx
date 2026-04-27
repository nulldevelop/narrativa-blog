import { ArticleCard } from '@/components/article-card'
import type { ArticleHero } from '@/components/hero-home'
import HeroHome from '@/components/hero-home'
import { Pagination } from '@/components/pagination-nav'
import { SectionTitle } from '@/components/section-title'
import { SeparatorSection } from '@/components/separator-section'
import { SidebarHome } from '@/components/sidebar-home'
import { getHomeData } from './_data-access/get-home-data'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>
}) {
  const { page: pageParam, category, tag } = await searchParams
  const currentPage = Number(pageParam) || 1
  const postsPerPage = 6

  const {
    mainFeaturedArticle,
    secondaryHero,
    generalFeatured,
    articles,
    totalPages,
    allTags
  } = await getHomeData(currentPage, postsPerPage, category, tag)

  return (
    <>
      {/* Hero com o Destaque Principal e os 3 Secundários - Ocultos se estiver filtrando para focar nos resultados */}
      {!category && !tag && (
        <HeroHome
          mainArticle={mainFeaturedArticle as ArticleHero | null}
          secondaryArticles={secondaryHero}
        />
      )}

      <div className="max-w-300 mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        <div className="grid grid-cols-[1fr_340px] gap-16 py-[clamp(3rem,6vw,5rem)] max-md:grid-cols-1 max-md:gap-12">
          <div className="flex flex-col">
            <section
              id="posts"
              aria-labelledby="titulo-recentes"
              className="scroll-mt-32"
            >
              {category && articles.length > 0 && (
                <SectionTitle
                  title={`Matérias: ${articles[0].category?.name}`}
                  id="titulo-recentes"
                />
              )}

              {tag && (
                <SectionTitle
                  title={`Tema: ${tag}`}
                  id="titulo-recentes"
                />
              )}

              {/* Seção Geral 1 e 2 (As duas notícias maiores abaixo do Hero) - Ocultas se houver filtro */}
              {currentPage === 1 && !category && !tag && generalFeatured.length > 0 && (
                <div className="grid grid-cols-2 gap-10 mb-12 max-sm:grid-cols-1">
                  {generalFeatured.map((article, i) => (
                    <ArticleCard
                      key={article.slug}
                      title={article.title}
                      subtitle={article.subtitle || ''}
                      date={new Date(
                        article.publishedAt || article.createdAt,
                      ).toLocaleDateString('pt-BR')}
                      readTime="7 min"
                      slug={article.slug}
                      imageUrl={article.coverImage || undefined}
                      variant="large"
                      delay={i * 0.1}
                      tags={article.tags}
                    />
                  ))}
                </div>
              )}

              {/* Listagem Geral do Site */}
              <ol className="flex flex-col">
                {articles.map((article, i) => (
                  <ArticleCard
                    key={article.slug}
                    title={article.title}
                    subtitle={article.subtitle || ''}
                    date={new Date(
                      article.publishedAt || article.createdAt,
                    ).toLocaleDateString('pt-BR')}
                    readTime="5 min"
                    slug={article.slug}
                    imageUrl={article.coverImage || undefined}
                    delay={i * 0.08}
                    tags={article.tags}
                  />
                ))}
              </ol>

              {articles.length === 0 && !generalFeatured.length && (
                <p className="py-20 text-center text-narrativa-cinza-texto italic font-serif">
                  Nenhuma matéria encontrada no momento para este filtro.
                </p>
              )}

              {totalPages > 1 && (
                <Pagination current={currentPage} total={totalPages} />
              )}
            </section>

            <SeparatorSection text="Bastidores do poder" />
          </div>

          <SidebarHome tags={allTags} />
        </div>
      </div>
    </>
  )
}
