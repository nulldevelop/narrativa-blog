import { ArticleCard } from '@/components/article-card'
import { FadeUp } from '@/components/fade-up'
import { SectionTitle } from '@/components/section-title'

const colunista = {
  nome: 'Nome do Colunista',
  cargo: 'Colunista',
  bio: 'Breve descrição sobre a trajetória do colunista, sua área de atuação e os temas principais abordados em suas matérias e publicações semanais no site.',
  imagem: '/placeholder-colunista.jpg', // Placeholder path
}

const noticiasColunista = [
  {
    tag: 'Categoria',
    title: 'Título de uma notícia ou matéria do colunista',
    subtitle:
      'Uma breve descrição sobre o conteúdo abordado neste artigo, resumindo os pontos principais de forma clara e objetiva.',
    date: '10 abr 2026',
    readTime: '5 min de leitura',
    slug: 'slug-noticia-generica-1',
    imageIndex: 1,
  },
  {
    tag: 'Categoria',
    title: 'Título de uma notícia ou matéria do colunista',
    subtitle:
      'Uma breve descrição sobre o conteúdo abordado neste artigo, resumindo os pontos principais de forma clara e objetiva.',
    date: '08 abr 2026',
    readTime: '5 min de leitura',
    slug: 'slug-noticia-generica-2',
    imageIndex: 2,
  },
  {
    tag: 'Categoria',
    title: 'Título de uma notícia ou matéria do colunista',
    subtitle:
      'Uma breve descrição sobre o conteúdo abordado neste artigo, resumindo os pontos principais de forma clara e objetiva.',
    date: '05 abr 2026',
    readTime: '5 min de leitura',
    slug: 'slug-noticia-generica-3',
    imageIndex: 3,
  },
  {
    tag: 'Categoria',
    title: 'Título de uma notícia ou matéria do colunista',
    subtitle:
      'Uma breve descrição sobre o conteúdo abordado neste artigo, resumindo os pontos principais de forma clara e objetiva.',
    date: '02 abr 2026',
    readTime: '5 min de leitura',
    slug: 'slug-noticia-generica-4',
    imageIndex: 4,
  },
  {
    tag: 'Categoria',
    title: 'Título de uma notícia ou matéria do colunista',
    subtitle:
      'Uma breve descrição sobre o conteúdo abordado neste artigo, resumindo os pontos principais de forma clara e objetiva.',
    date: '28 mar 2026',
    readTime: '5 min de leitura',
    slug: 'slug-noticia-generica-5',
    imageIndex: 1,
  },
  {
    tag: 'Categoria',
    title: 'Título de uma notícia ou matéria do colunista',
    subtitle:
      'Uma breve descrição sobre o conteúdo abordado neste artigo, resumindo os pontos principais de forma clara e objetiva.',
    date: '25 mar 2026',
    readTime: '5 min de leitura',
    slug: 'slug-noticia-generica-6',
    imageIndex: 2,
  },
]

export default function ColunistasPage() {
  return (
    <main className="min-h-screen bg-narrativa-branco">
      {/* Perfil do Colunista */}
      <section className="bg-narrativa-preto py-[clamp(4rem,8vw,6rem)] px-[clamp(1.5rem,5vw,4rem)] relative overflow-hidden hero-grid-lines">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-[1fr_2fr] gap-12 items-center max-md:grid-cols-1 max-md:gap-8">
            <FadeUp>
              <div className="aspect-[4/5] bg-narrativa-cinza-claro relative overflow-hidden border border-white/10">
                {/* Placeholder para foto grande */}
                <div className="absolute inset-0 flex items-center justify-center text-narrativa-preto/20 text-xs uppercase tracking-widest font-bold">
                  [ Foto do Colunista ]
                </div>
                {/* 
                  Em um cenário real, usaríamos <Image src={colunista.imagem} ... /> 
                  Aqui simulamos o visual editorial com um container estilizado
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-narrativa-preto/40 to-transparent" />
              </div>
            </FadeUp>

            <div className="flex flex-col">
              <FadeUp delay={0.1}>
                <p className="text-[0.65rem] tracking-[0.25em] uppercase text-narrativa-vermelho font-bold mb-4 flex items-center gap-3">
                  <span className="inline-block w-8 h-0.5 bg-narrativa-vermelho" />
                  Perfil do Colunista
                </p>
                <h1 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-black text-narrativa-branco leading-[1.1] mb-6">
                  {colunista.nome}
                </h1>
                <p className="text-[1.1rem] text-white/70 max-w-[650px] leading-[1.7] font-light mb-8 italic border-l-2 border-narrativa-dourado pl-6">
                  {colunista.bio}
                </p>
                <div className="text-[0.72rem] tracking-[0.14em] uppercase font-bold text-white/40">
                  {colunista.cargo}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Notícias do Colunista */}
      <div className="max-w-300 mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)]">
        <SectionTitle title="Notícias do colunista" />

        <div className="grid grid-cols-2 gap-x-16 gap-y-4 max-md:grid-cols-1">
          {noticiasColunista.map((article, i) => (
            <ArticleCard key={article.slug} {...article} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </main>
  )
}
