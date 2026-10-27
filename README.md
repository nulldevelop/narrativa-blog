# Narrativa

> Plataforma editorial multi-autor: blog com painel de gestão de conteúdo.

| | |
|---|---|
| **Tipo** | Projeto de cliente · CMS / blog |
| **Status** | Em produção |
| **Meu papel** | Desenvolvedor Full Stack (projeto completo) |

## Sobre o projeto

Plataforma para publicar artigos com vários autores. Cada autor tem um painel para escrever, revisar e publicar, e os leitores acompanham o conteúdo e assinam a newsletter.

## Funcionalidades

- Editor rico (TipTap) com tabelas, blocos de código, imagens e vídeos
- Artigos, categorias e tags, com pré-visualização antes de publicar
- Páginas institucionais e "curtas" (posts rápidos)
- Newsletter com confirmação em duas etapas (double opt-in)
- Multi-autor com controle de acesso por organização e permissões por módulo
- Configurações do site e armazenamento próprio de mídia

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · TipTap · Prisma · MySQL/MariaDB · Better Auth · Nodemailer · Biome

## Como rodar

Pré-requisitos: Node.js 20+, pnpm e MySQL/MariaDB.

```bash
pnpm install
cp .env.example .env   # crie o .env com as variáveis abaixo
pnpm prisma migrate dev
pnpm dev
```

## Variáveis de ambiente

`DATABASE_URL` (ou host, usuário, senha e nome do banco), `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` e SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`).

## Autor

**Pedro Andrade** — Desenvolvedor Full Stack · [null.dev](https://nulldev.com.br) · [LinkedIn](https://linkedin.com/in/pedrodevfull) · [GitHub](https://github.com/nulldevelop)