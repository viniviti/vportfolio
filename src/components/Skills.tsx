import type { SkillGroup } from "@/types/content";
import SectionLabel from "./SectionLabel";

// Slug do Simple Icons (cdn.simpleicons.org) para cada tecnologia.
// Só entram skills que têm logo de marca de verdade.
const SLUGS: Record<string, string> = {
  Angular: "angular",
  React: "react",
  "Next.js": "nextdotjs",
  "Vue.js": "vuedotjs",
  TypeScript: "typescript",
  JavaScript: "javascript",
  HTML5: "html5",
  CSS3: "css",
  "Tailwind CSS": "tailwindcss",
  Bootstrap: "bootstrap",
  "Node.js": "nodedotjs",
  MySQL: "mysql",
  PostgreSQL: "postgresql",
  Prisma: "prisma",
  Git: "git",
  GitHub: "github",
  "VS Code": "visualstudiocode",
  Figma: "figma",
  JSON: "json",
  "Jest (básico)": "jest",
  N8N: "n8n",
  "API Oficial da Meta": "meta",
};

// Tecnologias que aparecem maiores (hierarquia visual → assimetria).
const PRIMARY = new Set([
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Tailwind CSS",
  "Angular",
  "Vue.js",
  "Git",
]);

// Sempre presentes, mesmo que não venham do conteúdo salvo.
const EXTRA = ["Vue.js", "Figma", "VS Code"];

// Deslocamento vertical por item — cria uma base irregular (não simétrica).
const OFFSETS = [0, 26, 10, 34, 16, 28, 6, 20, 12];

export default function Skills({
  groups,
  linkedin,
}: {
  groups: SkillGroup[];
  linkedin?: string;
}) {
  const flat = Array.from(new Set([...groups.flatMap((g) => g.items), ...EXTRA])).filter(
    (name) => SLUGS[name]
  );

  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="container-x flex flex-col items-center text-center">
        <SectionLabel n="04">Skills &amp; stack</SectionLabel>

        <h2
          data-reveal
          className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          As ferramentas que uso pra <span className="text-gradient">construir</span>.
        </h2>

        <p data-reveal className="mt-5 max-w-lg text-muted">
          Do front-end ao banco de dados, com foco em código limpo e boas práticas.
        </p>

        {linkedin && (
          <a
            data-reveal
            data-cursor
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-violet transition-colors hover:text-fg"
          >
            Ver tudo no LinkedIn
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}

        {/* PAREDE DE LOGOS — assimétrica, sem cards */}
        <div
          data-reveal
          className="mt-20 flex w-full max-w-4xl flex-wrap items-start justify-center gap-x-11 gap-y-12 pb-10 sm:gap-x-16"
        >
          {flat.map((name, i) => {
            const slug = SLUGS[name];
            const size = PRIMARY.has(name) ? 46 : 32;
            return (
              <div
                key={name}
                data-cursor
                title={name}
                className="group flex flex-col items-center gap-3"
                style={{ transform: `translateY(${OFFSETS[i % OFFSETS.length]}px)` }}
              >
                <span
                  aria-hidden
                  className="block bg-muted transition-all duration-300 group-hover:-translate-y-1.5 group-hover:bg-violet"
                  style={{
                    width: size,
                    height: size,
                    WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
                    maskImage: `url(https://cdn.simpleicons.org/${slug})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
                <span className="text-[11px] leading-tight text-faint opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
