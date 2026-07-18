-- =====================================================================
--  SCHEMA DO PORTFÓLIO — rode isto no SQL Editor do seu projeto Supabase.
--  (Dashboard Supabase → SQL Editor → New query → cole tudo → Run)
-- =====================================================================

-- 1) Tabela de conteúdo (uma única linha, id = 'main', com todo o site em JSON)
create table if not exists public.content (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.content enable row level security;

-- Leitura pública: o site público lê o conteúdo com a chave anônima.
drop policy if exists "content_public_read" on public.content;
create policy "content_public_read"
  on public.content for select
  using (true);

-- IMPORTANTE: não criamos policies de INSERT/UPDATE para o público.
-- A escrita acontece só pelo painel admin, no servidor, usando a
-- SUPABASE_SERVICE_ROLE_KEY (que ignora o RLS com segurança).

-- 2) Bucket de imagens (fotos e prints de projetos enviados pelo admin)
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Leitura pública dos arquivos do bucket.
drop policy if exists "assets_public_read" on storage.objects;
create policy "assets_public_read"
  on storage.objects for select
  using (bucket_id = 'assets');

-- Pronto! O upload de imagens também usa a service role (server-side),
-- então não é preciso policy de insert para o público.
