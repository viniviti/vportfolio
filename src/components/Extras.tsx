import SectionLabel from "./SectionLabel";

type Cap = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const I = (p: React.SVGProps<SVGSVGElement>) => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

const CAPS: Cap[] = [
  {
    title: "Interfaces responsivas",
    desc: "Layouts que funcionam bem em qualquer tela, do mobile ao desktop, com atenção a detalhes, usabilidade e consistência visual.",
    icon: (
      <svg {...I({})}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Componentização",
    desc: "Componentes reutilizáveis e escaláveis em React, Next.js e Angular, com código limpo e boa organização.",
    icon: (
      <svg {...I({})}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Integração com APIs",
    desc: "Consumo e envio de dados via REST, conectando front-end e back-end de forma robusta e previsível.",
    icon: (
      <svg {...I({})}>
        <path d="M8 6l-6 6 6 6" />
        <path d="M16 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    title: "Fluxo ágil & Git",
    desc: "Versionamento, revisões de código e trabalho em equipe com metodologias ágeis (Scrum / Kanban).",
    icon: (
      <svg {...I({})}>
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="8" r="2.2" />
        <path d="M6 8.2v7.6M18 10.2c0 4-4 4.2-8 4.6" />
      </svg>
    ),
  },
  {
    title: "Performance & UX",
    desc: "Foco em carregamento rápido, acessibilidade e experiências fluidas que mantêm o usuário no fluxo.",
    icon: (
      <svg {...I({})}>
        <path d="M3.5 13a8.5 8.5 0 0117 0" />
        <path d="M12 13l3.5-3" />
        <path d="M4 18h16" />
      </svg>
    ),
  },
  {
    title: "Da ideia ao ar",
    desc: "Do protótipo ao deploy: transformo requisitos em produtos reais, usados por pessoas de verdade.",
    icon: (
      <svg {...I({})}>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
];

export default function Extras() {
  return (
    <section id="mais" className="relative py-24 sm:py-28">
      <div className="container-x">
        <SectionLabel n="06">O que eu faço</SectionLabel>

        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Do protótipo ao <span className="text-gradient">produto no ar</span>.
          </h2>
          <p data-reveal className="max-w-sm text-muted">
            Mais do que uma lista de tecnologias: o que eu realmente entrego quando entro num
            projeto.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {CAPS.map((c, i) => (
            <div
              key={c.title}
              data-reveal
              data-reveal-delay={(i * 0.06).toFixed(2)}
              data-cursor
              className="group relative flex flex-col gap-4 bg-bg p-7 transition-colors duration-300 hover:bg-surface/60"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-muted transition-all duration-300 group-hover:border-violet/60 group-hover:text-violet">
                {c.icon}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-fg">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.desc}</p>
              </div>
              <span className="pointer-events-none absolute right-6 top-7 font-mono text-xs text-faint/60 transition-colors group-hover:text-violet/70">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
