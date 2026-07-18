"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Falha no login.");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[40vmax] w-[40vmax] -translate-x-1/2 rounded-full bg-violet/15 blur-[120px]" />
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-line bg-surface/60 p-8 backdrop-blur"
      >
        <div className="mb-1 flex items-baseline gap-1 font-display text-2xl font-bold tracking-tightest">
          <span className="text-fg">Admin</span>
          <span className="text-violet">.</span>
        </div>
        <p className="mb-8 text-sm text-muted">Painel de conteúdo do portfólio.</p>

        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
          Usuário
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mb-4 w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-violet"
          placeholder="seu usuário"
        />

        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mb-6 w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-violet"
          placeholder="••••••••"
        />

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-fg py-3 font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>

        <a href="/" className="mt-6 block text-center font-mono text-xs text-muted hover:text-fg">
          ← voltar ao site
        </a>
      </form>
    </div>
  );
}
