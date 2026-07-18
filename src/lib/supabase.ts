import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const SUPABASE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "assets";

// O site funciona sem Supabase. Estes helpers retornam null quando não configurado.
export const isSupabaseConfigured = Boolean(url && anonKey);
export const isSupabaseWritable = Boolean(url && serviceKey);

// Importante: o Next.js cacheia chamadas fetch() por padrão, mesmo em rotas
// dinâmicas. Sem isso, o conteúdo salvo pelo admin pode nunca aparecer no
// site público — ele fica preso na primeira resposta que o Next cacheou.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

export function getAnonClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch },
  });
}

export function getServiceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch },
  });
}