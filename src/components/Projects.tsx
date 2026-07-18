"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProjectItem } from "@/types/content";
import SectionLabel from "./SectionLabel";
import { ArrowIcon, GithubIcon } from "./SocialIcons";

// Índice desta seção na pilha do snap-scroll (ver src/lib/sections.ts).
const MY_INDEX = 4;

function domainOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "preview";
  }
}

// Distância circular (mais curta) entre dois índices — base do loop infinito.
function circ(x: number, n: number) {
  let d = ((x % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

function Visual({ p }: { p: ProjectItem }) {
  const grad =
    p.accent === "emerald"
      ? "from-emerald/25 via-surface to-violet/15"
      : "from-violet/25 via-surface to-emerald/15";

  const hasLink = p.status === "live" && !!p.liveUrl;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-1.5 border-b border-line bg-bg/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        {hasLink ? (
          
            href={p.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-3 truncate rounded-md bg-surface px-3 py-0.5 font-mono text-[10px] text-muted transition-colors hover:text-violet"
          >
            {domainOf(p.liveUrl)}
          </a>
        ) : (
          <span className="ml-3 truncate rounded-md bg-surface px-3 py-0.5 font-mono text-[10px] text-muted">
            em-construcao.dev
          </span>
        )}
      </div>
      <div className={`relative flex-1 overflow-hidden bg-gradient-to-br ${grad}`}>
        {p.imageUrl ? (
          <Image src={p.imageUrl} alt={p.title} fill sizes="440px" className="object-cover" />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(var(--line)/0.6) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)/0.6) 1px, transparent 1px)",
                backgroundSize: "34px 34px",
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-mono text-5xl font-bold text-fg/15">
                {p.status === "live" ? "</>" : "◇"}
              </span>
            </div>
          </>
        )}

        {hasLink && (
          
            href={p.liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ${p.title} ao vivo`}
            onClick={(e) => e.stopPropagation()}
            className="group/arrow absolute bottom-2.5 right-2.5 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg/80 text-fg shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:border-violet hover:text-violet"
          >
            <ArrowIcon className="h-4 w-4 transition-transform group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ p, index }: { p: ProjectItem; index: number }) {
  const soon = p.status === "soon";
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border bg-surface/60 backdrop-blur-sm ${
        soon ? "border-dashed border-line/80" : "border-line"
      }`}
    >
      <div className="relative h-40 shrink-0 overflow-hidden lg:h-48">
        {soon ? (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface to-bg">
            <span className="font-mono text-5xl font-bold text-fg/10">◇</span>
          </div>
        ) : (
          <Visual p={p} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <div className="mb-2 flex items-center justify-between lg:mb-3">
          <span className="font-mono text-xs text-faint">
            {String(index + 1).padStart(2, "0")} · {p.year}
          </span>
          {soon ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-faint">
              em breve
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> live
            </span>
          )}
        </div>

        <h3 className={`font-display text-xl font-semibold lg:text-2xl ${soon ? "text-muted" : "text-fg"}`}>
          {p.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2 lg:mt-3 lg:line-clamp-3">
          {p.description}
        </p>

        {p.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 lg:mt-4">
            {p.tags.map((t) => (
              <span key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-4 lg:pt-6">
          {!soon && p.liveUrl && (
            
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group/btn inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5 lg:py-2.5"
            >
              Ver ao vivo
              <ArrowIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          )}
          {!soon && p.githubUrl && (
            
              href={p.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Código no GitHub"
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-fg lg:h-11 lg:w-11"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
          )}
          {soon && <span className="font-mono text-xs text-faint">Em construção, volte logo ✦</span>}
        </div>
      </div>
    </div>
  );
}

function GithubCard({ github }: { github: string }) {
  return (
    
      href={github}
      target="_blank"
      rel="noreferrer"
      className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-line bg-gradient-to-br from-violet/10 to-emerald/10 p-8 text-center"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full border border-line bg-surface">
        <GithubIcon className="h-7 w-7 text-fg" />
      </span>
      <p className="font-display text-2xl font-semibold text-fg">Mais no GitHub</p>
      <p className="max-w-[18rem] text-sm text-muted">
        Explore repositórios, experimentos e o código por trás dos projetos.
      </p>
      <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-violet">
        github.com <ArrowIcon className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

type Card =
  | { kind: "project"; p: ProjectItem; index: number }
  | { kind: "github" };

export default function Projects({ projects, github }: { projects: ProjectItem[]; github: string }) {
  const deck: Card[] = [
    ...projects.map((p, index) => ({ kind: "project" as const, p, index })),
    { kind: "github" as const },
  ];
  const N = deck.length;

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const prevRef = useRef(0); // valor anterior de "active" (para detectar wrap)
  const activeSectionRef = useRef(0);
  const prevSectionRef = useRef(0);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  // prevRef guarda o valor de active ANTES desta renderização (efeito roda após o commit).
  useEffect(() => {
    prevRef.current = active;
  }, [active]);

  // Move o baralho. loop=true → circular (setas/arraste/touch). loop=false → limitado (scroll).
  const move = (delta: number, loop = true) => {
    setActive((a) => {
      if (loop) return (((a + delta) % N) + N) % N;
      return Math.max(0, Math.min(N - 1, a + delta));
    });
  };
  const jumpTo = (i: number) => setActive(((i % N) + N) % N);

  // Modo interativo (mesma condição do SnapScroll): habilita o "guard" do scroll.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 620px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setInteractive(mq.matches && !reduce.matches);
    update();
    mq.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  // Guard do scroll (snap): gira o baralho e libera para a próxima/anterior seção nas pontas.
  useEffect(() => {
    if (!interactive) {
      if (window.__snapStepGuards) delete window.__snapStepGuards[MY_INDEX];
      return;
    }
    const guard = (dir: number) => {
      const a = activeRef.current;
      if (dir > 0) {
        if (a < N - 1) {
          move(1, false);
          return true;
        }
        return false; // última carta → segue para Contato
      } else {
        if (a > 0) {
          move(-1, false);
          return true;
        }
        return false; // primeira carta → volta para Skills
      }
    };
    window.__snapStepGuards = window.__snapStepGuards || {};
    window.__snapStepGuards[MY_INDEX] = guard;

    const onSection = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index;
      if (typeof idx !== "number") return;
      const prev = prevSectionRef.current;
      if (idx === MY_INDEX) setActive(prev > MY_INDEX ? N - 1 : 0);
      activeSectionRef.current = idx;
      prevSectionRef.current = idx;
    };
    window.addEventListener("section:change", onSection);

    return () => {
      window.removeEventListener("section:change", onSection);
      if (window.__snapStepGuards?.[MY_INDEX] === guard) delete window.__snapStepGuards[MY_INDEX];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, N]);

  // Setas do teclado (← →) giram o baralho em loop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (window.__snapEnabled && activeSectionRef.current !== MY_INDEX) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1, true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1, true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  // Arraste / swipe (mouse e toque). Cada ~64px de deslocamento = uma carta.
  const drag = useRef({ down: false, x: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { down: true, x: e.clientX, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 64) {
      move(dx < 0 ? 1 : -1, true);
      drag.current.x = e.clientX; // permite múltiplos passos no mesmo gesto
      drag.current.moved = true;
    }
  };
  const endDrag = () => {
    drag.current.down = false;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section id="projetos" className="relative py-20 sm:py-24">
      <div className="container-x">
        <SectionLabel n="05">Projetos selecionados</SectionLabel>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 data-reveal className="max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Coisas que eu <span className="text-gradient">coloquei no ar</span>.
          </h2>
          <p data-reveal className="hidden font-mono text-xs text-faint lg:block">
            role · arraste · ← →
          </p>
          <p data-reveal className="font-mono text-xs text-faint lg:hidden">
            deslize para o lado →
          </p>
        </div>
      </div>

      {/* DESKTOP / NOTEBOOK — coverflow original, inalterado (só ganhou overflow-hidden de segurança) */}
      <div className="hidden lg:block">
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          className="relative mx-auto h-[26rem] w-full max-w-6xl select-none overflow-hidden sm:h-[27rem]"
          style={{ perspective: "1800px", touchAction: "pan-y", cursor: "grab" }}
        >
          {deck.map((card, i) => {
            const d = circ(i - active, N);
            const dPrev = circ(i - prevRef.current, N);
            const wrapped = Math.abs(d - dPrev) > 1;
            const abs = Math.abs(d);
            const hidden = abs > 2;
            const isCenter = d === 0;

            const style: React.CSSProperties = {
              transform: `translateX(calc(-50% + ${d * 58}%)) scale(${Math.max(1 - abs * 0.16, 0.6)}) rotateY(${d * -6}deg)`,
              filter: isCenter ? "none" : `blur(${Math.min(abs * 2.5, 6)}px)`,
              opacity: hidden ? 0 : isCenter ? 1 : Math.max(1 - abs * 0.42, 0.1),
              zIndex: 50 - abs,
              pointerEvents: hidden ? "none" : "auto",
              transition: wrapped
                ? "none"
                : "transform 620ms cubic-bezier(0.22,1,0.36,1), filter 620ms ease, opacity 620ms ease",
            };

            return (
              <div
                key={i}
                className="absolute left-1/2 top-0 h-full w-[88vw] max-w-[25rem] will-change-transform"
                style={style}
                onClick={() => {
                  if (!isCenter && !hidden) jumpTo(i);
                }}
                aria-hidden={hidden}
              >
                {card.kind === "project" ? (
                  <ProjectCard p={card.p} index={card.index} />
                ) : (
                  <GithubCard github={github} />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5">
          {deck.map((_, i) => {
            const on = ((active % N) + N) % N === i;
            return (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                aria-label={`Ir para carta ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  on ? "w-7 bg-violet" : "w-1.5 bg-line hover:bg-muted"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* MOBILE / TABLET — lista com scroll horizontal nativo (sem transforms 3D) */}
      <div className="lg:hidden">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: "1.5rem", scrollPaddingRight: "1.5rem" }}
        >
          {deck.map((card, i) => (
            <div
              key={i}
              className="h-[28rem] w-[82vw] max-w-sm shrink-0 snap-center sm:h-[30rem] sm:w-[55vw]"
            >
              {card.kind === "project" ? (
                <ProjectCard p={card.p} index={card.index} />
              ) : (
                <GithubCard github={github} />
              )}
            </div>
          ))}
          <div className="shrink-0 basis-6 sm:basis-10" aria-hidden />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5">
          {deck.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-violet" : "bg-line"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}