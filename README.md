# Portfólio — Vinícius Freitas Viti

Portfólio de desenvolvedor front-end feito **do zero**, com um hero "split" interativo (designer / front-end, no estilo _adhamdannaway.com_), personagem com olhos que seguem o cursor (_robbowen.digital_), scroll suave premium com trilho numerado (_dvlpr.pro_) e um **painel admin** protegido para editar tudo sem tocar no código.

> Modo **escuro por padrão** com botão para **modo claro** — pensado para agradar recrutadores dos dois lados. Cores: **roxo** (principal) + **verde esmeralda** (secundário).

---

## ✨ Recursos

- **Hero split** metade _designer_ / metade _front-end_, com parallax 3D, hover que alterna os dois lados e reveal animado (GSAP).
- **Olhos que seguem o mouse** — um personagem minimalista que "olha" para o cursor.
- **Scroll suave (Lenis)** + **trilho lateral numerado** que acompanha a seção atual.
- Layout **assimétrico e editorial** (nada de grid de cards simétrico): timeline, marquees cinéticas, slider de projetos com moldura de navegador.
- **Slider de projetos** horizontal (arrasta, setas, snap) já com _Blog do Vinicè_ e _VCurrículo_ + slots **"Em breve"**.
- **Tema claro/escuro** com persistência, sem flash.
- **Painel admin** (`/admin`) para editar textos, fotos, projetos, links — **tudo** — com upload de imagens.
- **Funciona sem banco**: sem Supabase configurado, o site já sobe com o conteúdo real do currículo (fallback). Com Supabase, o admin passa a salvar de verdade.
- Pronto para **deploy na Vercel**.

## 🧱 Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Supabase (Postgres + Storage) · jose (sessão JWT).

---

## 🚀 Rodando localmente

```bash
npm install
   # e preencha os valores
npm run dev
```

Abra `http://localhost:3000`. O painel fica em `http://localhost:3000/admin`.

## 🔐 Variáveis de ambiente (`.env.local`)

```bash
# Login do painel admin
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=uma_senha_forte
AUTH_SECRET=string_aleatoria_bem_longa   # openssl rand -base64 48

# Supabase (opcional, mas necessário para SALVAR pelo admin)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # NUNCA exponha no client
NEXT_PUBLIC_SUPABASE_BUCKET=assets
```

Sem as chaves do Supabase o site funciona normalmente (conteúdo padrão) — só o botão **Salvar** do admin fica desabilitado.

## 🗄️ Configurando o Supabase (grátis)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, cole e rode o arquivo [`supabase/schema.sql`](./supabase/schema.sql). Isso cria a tabela `content` e o bucket `assets`.
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
4. Reinicie o `npm run dev`. Pronto: o admin já salva e faz upload de imagens.

## 🛠️ Usando o painel admin

- Acesse `/admin`, faça login com `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Abas: **Geral** (SEO, logo, redes), **Hero**, **Sobre**, **Trajetória**, **Skills**, **Idiomas & Certif.**, **Projetos**, **Contato**.
- Edite, reordene (↑ ↓) e adicione itens. Faça **upload** de fotos direto nos campos de imagem.
- Clique em **Salvar**. O site público reflete na hora (renderização dinâmica).
- Para adicionar um projeto real depois: aba **Projetos → + Adicionar projeto**, troque o status para **Live** e cole o link.

## ☁️ Deploy na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com) → **New Project** → importe o repo.
3. Em **Environment Variables**, adicione todas as variáveis do `.env.local`.
4. Deploy. A cada `git push` a Vercel publica de novo.

> Dica: mantenha `SUPABASE_SERVICE_ROLE_KEY` e `AUTH_SECRET` apenas na Vercel (nunca commitados).

---

## 📁 Estrutura

```
src/
  app/
    page.tsx            → site público (server component, busca conteúdo)
    layout.tsx          → tema (dark/light sem flash) + fontes
    admin/              → login + dashboard do painel
    api/                → login/logout, content (GET/PUT), upload
  components/           → Hero, Projects, Nav, ScrollRail, FollowEyes, admin/…
  lib/
    defaultContent.ts   → conteúdo real do currículo (fallback)
    content.ts          → lê/salva no Supabase com fallback
    auth.ts             → sessão JWT (jose)
  types/content.ts      → modelo de dados editável
supabase/schema.sql     → tabela + bucket + policies
middleware.ts           → protege /admin
```

## 🎨 Ajustes rápidos

- **Cores/tema:** variáveis em `src/app/globals.css` (`--violet`, `--emerald`, `--bg`, etc.).
- **Seções/ordem do trilho:** `src/lib/sections.ts`.
- **Conteúdo padrão:** `src/lib/defaultContent.ts`.

---

Feito com Next.js, GSAP & muito café. © 2026 Vinícius Freitas Viti.
