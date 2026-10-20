# Narrativa Blog

> Plataforma jornalística política em Next.js com editor de matérias, newsletter por e-mail (double opt-in) e painel de autoria baseado em papéis (roles).

[**Repositório**](https://github.com/nulldevelop/narrativa-blog)

<!-- Adicione uma captura de tela real do sistema, se disponível. -->

## Sobre o projeto

O **Narrativa — política, poder e versão** é um blog/CMS de jornalismo político em língua portuguesa, com sede editorial em Curitiba/PR. O problema que resolve é o de publicar matérias com profundidade (galerias de imagens, tempo de leitura, contador de visualizações) de forma simples para redatores, mantendo um site público rápido e indexável para o leitor.

O público-alvo são jornalistas/redatores (painel de autoria) e leitores (site público com homepage hierárquica, curtas do dia e newsletter).

O principal diferencial técnico é a arquitetura full-stack dentro do próprio Next.js (Server Actions + Route Handlers), com colocation de `_data-access`/`_actions`/`_components` por feature, cache por tags (`unstable_cache` + `revalidateTag`) e uma camada própria de permissões (matriz papel→ação) sobre o Better Auth com plugin de organização.

## Funcionalidades

- [x] Site público com homepage hierárquica (hero, destaques, seções por categoria, paginação).
- [x] Página de matéria com SEO/Open Graph, galeria de imagens, barra de progresso de leitura, botões de compartilhamento e contador de views (deduplicado via `sessionStorage`).
- [x] Curtas (notícias breves) agrupadas por data na sidebar.
- [x] Newsletter com confirmação dupla (cadastro → e-mail de confirmação via SMTP → endpoint de confirmação por token).
- [x] Autenticação e-Senha (Better Auth): registro, login, sessão, rate limiting.
- [x] Painel do autor: CRUD de matérias (editor rico SunEditor, capa, galeria, tags, posição na home), rascunhos, arquivamento, categorias e curtas com estatísticas.
- [x] Upload e remoção de imagens com validação de tipo e tamanho (5MB).

## Tecnologias

- **Frontend:** Next.js 16 (App Router, React Compiler), React 19, Tailwind CSS 4, shadcn/ui (Radix), SunEditor 3 (editor rico), Lucide/Tabler Icons, sonner, react-hook-form + Zod.
- **Backend:** Next.js Server Actions e Route Handlers (sem servidor separado), Better Auth 1.5 (com plugin de organização e campo customizado `role`), Nodemailer (SMTP).
- **Banco de dados:** MySQL (ou MariaDB) com Prisma ORM 7 (driver adapter `@prisma/adapter-mariadb`, cliente gerado em `src/generated/prisma`).
- **Infraestrutura:** não configurada no repositório (sem Docker/CI); uploads ficam em disco local (`storage/`), servidos por `/api/media/[...path]` — hospedagem precisa de disco persistente.
- **Testes:** nenhum framework configurado no momento (sem testes automatizados).
- **Qualidade de código:** Biome 2.2 (lint/format), TypeScript 5.

## Arquitetura

Aplicação full-stack única (Next.js App Router). O front conversa com o back via **Server Actions** (mutações com autenticação e `revalidateTag`) e **Route Handlers** (`/api/auth`, `/api/upload/article`, `/api/media`, `/api/newsletter/confirmar`).

Cada feature fica colocationada em rotas protegidas:

```
src/app/(protected)/dashboard-author/<feature>/
├── _data-access/   # queries Prisma com cache por tag
├── _actions/       # server actions (auth + revalidateTag)
└── _components/    # formulários client
```

Decisões importantes:

- **Cache por tags** (`articles`, `tags`, `curtas`) com revalidação explícita nas mutações; a home usa retry com backoff e degrada para dados vazios em caso de falha no banco (evita 500).
- **Homepage orientada a tags**: tags de sistema (`home-principal`, `home-destaque-1/2`, `home-geral-1/2`, `home-listagem`) posicionam a matéria nos slots editoriais.
- **Auth/papéis**: middleware protege `/dashboard*` checando o cookie de sessão; layout revalida a sessão no server e redireciona; matriz de permissões em `src/lib/permissions/`.
- **Multi-tenancy scaffolded, single-tenant na prática**: modelos `Organization`/`Member` existem e todo usuário novo é auto-membro da organização `narrativa`, mas não há troca de tenant.
- **Uploads em disco local** (`storage/materia/<articleId>/imagens/`) em vez de storage cloud — decisão simples para dev local, com limitação de deploy (ver seção Limitações).

## Pré-requisitos

- Node.js 20.9+ (requisito do Next.js 16)
- pnpm 9+ (o repositório usa pnpm; `lockfileVersion: 9`)
- Servidor MySQL ou MariaDB acessível
- Conta SMTP para os e-mails de confirmação da newsletter

## Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/nulldevelop/narrativa-blog.git
cd narrativa-blog
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores necessários.

```env
DATABASE_URL=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
```

Inclua somente as variáveis que o projeto realmente utiliza. Nunca publique credenciais reais.

Observações:

- `DATABASE_URL` é usada pelo Prisma CLI (migrations); as variáveis `DATABASE_*` são usadas na conexão em runtime (`src/lib/prisma.ts`).
- `SMTP_*` é necessário apenas se a newsletter for utilizada (os e-mails de confirmação saem via Nodemailer).

### 4. Prepare o banco de dados

```bash
npx prisma migrate dev
npx prisma db seed
```

O seed cria a organização `narrativa`, os módulos (artigos, categorias, newsletter, usuários) e 7 categorias editoriais.

### 5. Inicie a aplicação

```bash
pnpm dev
```

A aplicação sobe em `http://localhost:3000`. Registre um usuário em `/register` — o papel padrão é `AUTHOR`, com acesso ao painel em `/dashboard-author`.

> Comandos úteis: `pnpm lint` (Biome), `pnpm format`, `pnpm build`, `pnpm start`, `npx prisma studio`.

## Testes

Ainda não há testes automatizados configurados no projeto (nenhum framework de teste instalado, nenhum script de teste). As áreas que mais se beneficiariam de cobertura primeiro são: server actions de artigo/newsletter, camada de permissões (`src/lib/permissions/`) e o endpoint de upload.

## Decisões técnicas

- **Server Actions + colocation**: cada feature concentra queries, mutações e UI na própria rota, reduzindo acoplamento entre módulos e facilitando a leitura do fluxo de dados.
- **Better Auth com plugin de organização e hook de banco**: ao registrar, o usuário é automaticamente membro da organização existente, preparando o terreno para multi-tenant sem implementá-lo ainda.
- **Cache com tags em vez de revalidatePath global**: mutações invalidam apenas as áreas afetadas (artigos, tags, curtas), mantendo a home responsiva.
- **`generateStaticParams` desativado para matérias**: decisão deliberada para não sobrecarregar o banco no build; as páginas são renderizadas sob demanda (SSR).
- **Editor SunEditor**: escolhido para o painel de autoria; pacotes TipTap e editores Markdown estão instalados mas não são utilizados (candidatos a remoção).
- **Contador de views com deduplicação no cliente**: `ViewTracker` usa `sessionStorage` para não inflar métricas com refreshes do mesmo usuário.
- **Servir mídia via Route Handler própria**: `/api/media/[...path]` com proteção contra path traversal, em vez de expor o diretório estático.

## Limitações conhecidas

- Uploads gravam em disco local (`storage/`) — não é compatível com hosts serverless (ex.: Vercel) sem migrar para storage de objetos (S3, R2, etc.).
- Painel do editor incompleto: apenas overview; rotas de gestão de matérias/categorias do editor ainda não existem.
- Formulário de contato sem envio real; página de colunistas com dados estáticos.
- Sem testes automatizados e sem pipeline de CI.
- Multi-tenancy apenas scaffoldado (organização fixa `narrativa`; módulo de sync é um stub simulado).
- Pacotes não utilizados no `package.json` (suite TipTap, `@uiw/react-md-editor`, `react-markdown`).

## Contribuição

O projeto é privado/interno no momento; contribuições externas não são aceitas. Para reportar problemas, abra uma issue no repositório ou entre em contato pelo GitHub do autor.

## Licença

Sem licença definida. Todos os direitos reservados.

## Autor

**Pedro Andrade (devpedroA)**

- GitHub: https://github.com/nulldevelop
