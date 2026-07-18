"use client";

import { useEffect, useState } from "react";
import type {
  SiteContent,
  ExperienceItem,
  SkillGroup,
  LanguageItem,
  CertificateItem,
  ProjectItem,
} from "@/types/content";
import { Field, Area, ListArea, Select, ImageField, RepeaterItem } from "./fields";

const TABS = [
  "Geral",
  "Hero",
  "Sobre",
  "Trajetória",
  "Skills",
  "Idiomas & Certif.",
  "Projetos",
  "Contato",
] as const;
type Tab = (typeof TABS)[number];

function arrMove<T>(arr: T[], i: number, dir: number): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

const newExperience = (): ExperienceItem => ({
  role: "Novo cargo",
  company: "Empresa",
  period: "Ano → Ano",
  bullets: [],
  tags: [],
});
const newSkill = (): SkillGroup => ({ label: "Novo grupo", items: [] });
const newLanguage = (): LanguageItem => ({ flag: "🌐", name: "Idioma", level: "Básico" });
const newCert = (): CertificateItem => ({ title: "Novo certificado", issuer: "Emissor" });
const newProject = (): ProjectItem => ({
  id: `p-${Date.now()}`,
  title: "Novo projeto",
  description: "",
  tags: [],
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
  status: "soon",
  year: "2026",
  accent: "violet",
});

export default function AdminDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [writable, setWritable] = useState(true);
  const [tab, setTab] = useState<Tab>("Geral");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/content");
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const data = await res.json();
        setContent(data.content);
        setWritable(Boolean(data.writable));
      } catch {
        setMsg({ type: "err", text: "Erro ao carregar o conteúdo." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (updater: (c: SiteContent) => SiteContent) =>
    setContent((prev) => (prev ? updater(prev) : prev));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) setMsg({ type: "err", text: data.error || "Erro ao salvar." });
      else setMsg({ type: "ok", text: "Salvo com sucesso ✓" });
    } catch {
      setMsg({ type: "err", text: "Erro de conexão." });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  if (loading || !content) {
    return (
      <div className="grid min-h-screen place-items-center font-mono text-sm text-muted">
        Carregando painel…
      </div>
    );
  }

  const c = content;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      {/* Header */}
      <div className="sticky top-0 z-20 -mx-5 mb-6 border-b border-line bg-bg/80 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1 font-display text-xl font-bold tracking-tightest">
              Painel<span className="text-violet">.</span>
            </div>
            <p className="font-mono text-[11px] text-faint">
              {writable ? "Supabase conectado" : "Somente edição · configure o Supabase p/ salvar"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line px-3 py-2 text-xs text-muted transition-colors hover:text-fg"
            >
              Ver site ↗
            </a>
            <button
              onClick={logout}
              className="rounded-lg border border-line px-3 py-2 text-xs text-muted transition-colors hover:text-fg"
            >
              Sair
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-fg px-4 py-2 text-xs font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
        {msg && (
          <p
            className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
              msg.type === "ok"
                ? "border-emerald/40 bg-emerald/10 text-emerald"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {msg.text}
          </p>
        )}
        {!writable && (
          <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            Sem Supabase configurado, o botão Salvar não persiste. Preencha as variáveis de ambiente
            (veja o README) para habilitar a edição em produção.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
              tab === t
                ? "bg-violet text-white"
                : "border border-line text-muted hover:text-fg"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------- GERAL ---------- */}
      {tab === "Geral" && (
        <div className="space-y-8">
          <Card title="SEO & Marca">
            <Field label="Título (aba/SEO)" value={c.meta.title} onChange={(v) => set((x) => ({ ...x, meta: { ...x.meta, title: v } }))} />
            <Area label="Descrição (SEO)" value={c.meta.description} onChange={(v) => set((x) => ({ ...x, meta: { ...x.meta, description: v } }))} />
            <Field label="Iniciais do logo" value={c.meta.initials} onChange={(v) => set((x) => ({ ...x, meta: { ...x.meta, initials: v } }))} />
          </Card>
          <Card title="Redes & Contato">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="GitHub (URL)" mono value={c.social.github} onChange={(v) => set((x) => ({ ...x, social: { ...x.social, github: v } }))} />
              <Field label="LinkedIn (URL)" mono value={c.social.linkedin} onChange={(v) => set((x) => ({ ...x, social: { ...x.social, linkedin: v } }))} />
              <Field label="Facebook (URL)" mono value={c.social.facebook} onChange={(v) => set((x) => ({ ...x, social: { ...x.social, facebook: v } }))} />
              <Field label="E-mail" mono value={c.social.email} onChange={(v) => set((x) => ({ ...x, social: { ...x.social, email: v } }))} />
              <Field label="WhatsApp (URL wa.me)" mono value={c.social.whatsapp} onChange={(v) => set((x) => ({ ...x, social: { ...x.social, whatsapp: v } }))} />
              <Field label="Telefone (texto)" value={c.social.phoneLabel} onChange={(v) => set((x) => ({ ...x, social: { ...x.social, phoneLabel: v } }))} />
            </div>
          </Card>
        </div>
      )}

      {/* ---------- HERO ---------- */}
      {tab === "Hero" && (
        <Card title="Hero (topo do site)">
          <Field label="Selo de disponibilidade" value={c.hero.availableBadge} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, availableBadge: v } }))} />
          <Field label="Nome" value={c.hero.name} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, name: v } }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Palavra esquerda" value={c.hero.leftWord} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, leftWord: v } }))} />
            <Field label="Palavra direita" value={c.hero.rightWord} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, rightWord: v } }))} />
          </div>
          <Area label="Texto lado esquerdo (designer)" value={c.hero.leftText} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, leftText: v } }))} />
          <Area label="Texto lado direito (front-end)" value={c.hero.rightText} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, rightText: v } }))} />
          <ImageField label="Foto do retrato" value={c.hero.portraitUrl} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, portraitUrl: v } }))} />
          <Field label="Link do currículo (botão)" mono value={c.hero.resumeUrl} onChange={(v) => set((x) => ({ ...x, hero: { ...x.hero, resumeUrl: v } }))} />
        </Card>
      )}

      {/* ---------- SOBRE ---------- */}
      {tab === "Sobre" && (
        <Card title="Sobre">
          <Field label="Rótulo da seção" value={c.about.heading} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, heading: v } }))} />
          <ListArea label="Parágrafos" rows={6} values={c.about.paragraphs} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, paragraphs: v } }))} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Curso" value={c.about.education.course} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, education: { ...x.about.education, course: v } } }))} />
            <Field label="Instituição" value={c.about.education.place} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, education: { ...x.about.education, place: v } } }))} />
            <Field label="Período" value={c.about.education.period} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, education: { ...x.about.education, period: v } } }))} />
          </div>
          <ImageField label="Foto da seção Sobre" value={c.about.photoUrl} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, photoUrl: v } }))} />
          <Field label="Localização" value={c.about.location} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, location: v } }))} />
          <Area label="Disponibilidade" value={c.about.availability} onChange={(v) => set((x) => ({ ...x, about: { ...x.about, availability: v } }))} />
        </Card>
      )}

      {/* ---------- TRAJETÓRIA ---------- */}
      {tab === "Trajetória" && (
        <Card title="Experiências">
          <div className="space-y-3">
            {c.experience.map((it, i) => (
              <RepeaterItem
                key={i}
                title={`${it.role} · ${it.company}`}
                onRemove={() => set((x) => ({ ...x, experience: x.experience.filter((_, k) => k !== i) }))}
                onUp={() => set((x) => ({ ...x, experience: arrMove(x.experience, i, -1) }))}
                onDown={() => set((x) => ({ ...x, experience: arrMove(x.experience, i, 1) }))}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Cargo" value={it.role} onChange={(v) => set((x) => ({ ...x, experience: x.experience.map((e, k) => (k === i ? { ...e, role: v } : e)) }))} />
                  <Field label="Empresa" value={it.company} onChange={(v) => set((x) => ({ ...x, experience: x.experience.map((e, k) => (k === i ? { ...e, company: v } : e)) }))} />
                </div>
                <Field label="Período" value={it.period} onChange={(v) => set((x) => ({ ...x, experience: x.experience.map((e, k) => (k === i ? { ...e, period: v } : e)) }))} />
                <ListArea label="Descrições" rows={5} values={it.bullets} onChange={(v) => set((x) => ({ ...x, experience: x.experience.map((e, k) => (k === i ? { ...e, bullets: v } : e)) }))} />
                <ListArea label="Tags / techs" values={it.tags} onChange={(v) => set((x) => ({ ...x, experience: x.experience.map((e, k) => (k === i ? { ...e, tags: v } : e)) }))} />
              </RepeaterItem>
            ))}
          </div>
          <AddButton label="+ Adicionar experiência" onClick={() => set((x) => ({ ...x, experience: [...x.experience, newExperience()] }))} />
        </Card>
      )}

      {/* ---------- SKILLS ---------- */}
      {tab === "Skills" && (
        <div className="space-y-8">
          <Card title="Grupos de skills">
            <div className="space-y-3">
              {c.skills.map((g, i) => (
                <RepeaterItem
                  key={i}
                  title={g.label}
                  onRemove={() => set((x) => ({ ...x, skills: x.skills.filter((_, k) => k !== i) }))}
                  onUp={() => set((x) => ({ ...x, skills: arrMove(x.skills, i, -1) }))}
                  onDown={() => set((x) => ({ ...x, skills: arrMove(x.skills, i, 1) }))}
                >
                  <Field label="Nome do grupo" value={g.label} onChange={(v) => set((x) => ({ ...x, skills: x.skills.map((e, k) => (k === i ? { ...e, label: v } : e)) }))} />
                  <ListArea label="Itens" values={g.items} onChange={(v) => set((x) => ({ ...x, skills: x.skills.map((e, k) => (k === i ? { ...e, items: v } : e)) }))} />
                </RepeaterItem>
              ))}
            </div>
            <AddButton label="+ Adicionar grupo" onClick={() => set((x) => ({ ...x, skills: [...x.skills, newSkill()] }))} />
          </Card>
          <Card title="Soft skills">
            <ListArea label="Soft skills" rows={5} values={c.softSkills} onChange={(v) => set((x) => ({ ...x, softSkills: v }))} />
          </Card>
        </div>
      )}

      {/* ---------- IDIOMAS & CERTIFICADOS ---------- */}
      {tab === "Idiomas & Certif." && (
        <div className="space-y-8">
          <Card title="Idiomas">
            <div className="space-y-3">
              {c.languages.map((l, i) => (
                <RepeaterItem
                  key={i}
                  title={`${l.flag} ${l.name}`}
                  onRemove={() => set((x) => ({ ...x, languages: x.languages.filter((_, k) => k !== i) }))}
                  onUp={() => set((x) => ({ ...x, languages: arrMove(x.languages, i, -1) }))}
                  onDown={() => set((x) => ({ ...x, languages: arrMove(x.languages, i, 1) }))}
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Bandeira (emoji)" value={l.flag} onChange={(v) => set((x) => ({ ...x, languages: x.languages.map((e, k) => (k === i ? { ...e, flag: v } : e)) }))} />
                    <Field label="Idioma" value={l.name} onChange={(v) => set((x) => ({ ...x, languages: x.languages.map((e, k) => (k === i ? { ...e, name: v } : e)) }))} />
                    <Field label="Nível" value={l.level} onChange={(v) => set((x) => ({ ...x, languages: x.languages.map((e, k) => (k === i ? { ...e, level: v } : e)) }))} />
                  </div>
                </RepeaterItem>
              ))}
            </div>
            <AddButton label="+ Adicionar idioma" onClick={() => set((x) => ({ ...x, languages: [...x.languages, newLanguage()] }))} />
          </Card>
          <Card title="Certificados">
            <div className="space-y-3">
              {c.certificates.map((ct, i) => (
                <RepeaterItem
                  key={i}
                  title={ct.title}
                  onRemove={() => set((x) => ({ ...x, certificates: x.certificates.filter((_, k) => k !== i) }))}
                  onUp={() => set((x) => ({ ...x, certificates: arrMove(x.certificates, i, -1) }))}
                  onDown={() => set((x) => ({ ...x, certificates: arrMove(x.certificates, i, 1) }))}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Título" value={ct.title} onChange={(v) => set((x) => ({ ...x, certificates: x.certificates.map((e, k) => (k === i ? { ...e, title: v } : e)) }))} />
                    <Field label="Emissor" value={ct.issuer} onChange={(v) => set((x) => ({ ...x, certificates: x.certificates.map((e, k) => (k === i ? { ...e, issuer: v } : e)) }))} />
                  </div>
                </RepeaterItem>
              ))}
            </div>
            <AddButton label="+ Adicionar certificado" onClick={() => set((x) => ({ ...x, certificates: [...x.certificates, newCert()] }))} />
          </Card>
        </div>
      )}

      {/* ---------- PROJETOS ---------- */}
      {tab === "Projetos" && (
        <Card title="Projetos">
          <p className="mb-4 text-xs text-muted">
            Arraste, edite ou adicione. Use status <b>live</b> para projetos publicados e <b>em breve</b> para placeholders.
          </p>
          <div className="space-y-3">
            {c.projects.map((p, i) => (
              <RepeaterItem
                key={p.id}
                title={`${p.title} ${p.status === "live" ? "· live" : "· em breve"}`}
                onRemove={() => set((x) => ({ ...x, projects: x.projects.filter((_, k) => k !== i) }))}
                onUp={() => set((x) => ({ ...x, projects: arrMove(x.projects, i, -1) }))}
                onDown={() => set((x) => ({ ...x, projects: arrMove(x.projects, i, 1) }))}
              >
                <Field label="Título" value={p.title} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, title: v } : e)) }))} />
                <Area label="Descrição" value={p.description} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, description: v } : e)) }))} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Ano" value={p.year} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, year: v } : e)) }))} />
                  <Select label="Status" value={p.status} options={[{ value: "live", label: "Live" }, { value: "soon", label: "Em breve" }]} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, status: v as ProjectItem["status"] } : e)) }))} />
                  <Select label="Cor" value={p.accent} options={[{ value: "violet", label: "Roxo" }, { value: "emerald", label: "Verde" }]} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, accent: v as ProjectItem["accent"] } : e)) }))} />
                </div>
                <ListArea label="Tags" values={p.tags} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, tags: v } : e)) }))} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Link ao vivo" mono value={p.liveUrl} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, liveUrl: v } : e)) }))} />
                  <Field label="GitHub" mono value={p.githubUrl} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, githubUrl: v } : e)) }))} />
                </div>
                <ImageField label="Imagem do projeto (opcional)" value={p.imageUrl} onChange={(v) => set((x) => ({ ...x, projects: x.projects.map((e, k) => (k === i ? { ...e, imageUrl: v } : e)) }))} />
              </RepeaterItem>
            ))}
          </div>
          <AddButton label="+ Adicionar projeto" onClick={() => set((x) => ({ ...x, projects: [...x.projects, newProject()] }))} />
        </Card>
      )}

      {/* ---------- CONTATO ---------- */}
      {tab === "Contato" && (
        <Card title="Contato">
          <Field label="Título" value={c.contact.heading} onChange={(v) => set((x) => ({ ...x, contact: { ...x.contact, heading: v } }))} />
          <Area label="Subtítulo" value={c.contact.subheading} onChange={(v) => set((x) => ({ ...x, contact: { ...x.contact, subheading: v } }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Localização" value={c.contact.location} onChange={(v) => set((x) => ({ ...x, contact: { ...x.contact, location: v } }))} />
            <Field label="Disponibilidade" value={c.contact.availability} onChange={(v) => set((x) => ({ ...x, contact: { ...x.contact, availability: v } }))} />
          </div>
        </Card>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface/40 p-5 sm:p-6">
      <h2 className="mb-5 font-display text-lg font-semibold text-fg">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full rounded-lg border border-dashed border-line py-2.5 text-sm text-muted transition-colors hover:border-violet hover:text-fg"
    >
      {label}
    </button>
  );
}
