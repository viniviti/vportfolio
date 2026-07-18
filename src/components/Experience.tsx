"use client";

import { useEffect, useRef, useState } from "react";
import type { ExperienceItem } from "@/types/content";
import SectionLabel from "./SectionLabel";

// Índice desta seção na pilha do snap-scroll (ver src/lib/sections.ts).
const MY_INDEX = 2;

export default function Experience({ items }: { items: ExperienceItem[] }) {
  // Ordem cronológica: do mais antigo (2023) para o mais recente.
  // Os dados vêm do mais novo → mais antigo, então invertemos aqui.
  const ordered = [...items].reverse();
  const total = ordered.length;
  const last = Math.max(0, total - 1);

  // Modo interativo: só "prende" o scroll em telas grandes (igual ao SnapScroll).
  const [interactive, setInteractive] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const stepRef = useRef(0);
  const prevSectionRef = useRef(0);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Mesma condição do SnapScroll para decidir se o modo fixo está ativo.
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

  const go = (next: number, d: 1 | -1) => {
    const clamped = Math.max(0, Math.min(last, next));
    setDir(d);
    setStep(clamped);
  };

  // Registra o "guard" que intercepta o scroll enquanto ainda há trajetórias
  // para revelar. Também reposiciona o passo ao entrar/sair da seção.
  useEffect(() => {
    if (!interactive) {
      if (window.__snapStepGuards) delete window.__snapStepGuards[MY_INDEX];
      return;
    }

    const guard = (d: number) => {
      const cur = stepRef.current;
      if (d > 0) {
        if (cur < last) {
          go(cur + 1, 1);
          return true; // consumiu — não troca de seção
        }
        return false; // acabou → libera para a próxima seção
      } else {
        if (cur > 0) {
          go(cur - 1, -1);
          return true;
        }
        return false;
      }
    };
    window.__snapStepGuards = window.__snapStepGuards || {};
    window.__snapStepGuards[MY_INDEX] = guard;

    const onSection = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index;
      if (typeof idx !== "number") return;
      const prev = prevSectionRef.current;
      if (idx === MY_INDEX) {
        // Vindo de cima → começa no 0; vindo de baixo → começa no último.
        if (prev > MY_INDEX) go(last, -1);
        else go(0, 1);
      }
      prevSectionRef.current = idx;
    };
    window.addEventListener("section:change", onSection);

    return () => {
      window.removeEventListener("section:change", onSection);
      if (window.__snapStepGuards?.[MY_INDEX] === guard) {
        delete window.__snapStepGuards[MY_INDEX];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, last]);

  const progress = last === 0 ? 100 : (step / last) * 100;

  // ---------------------------------------------------------------
  // MODO FIXO (desktop): slider horizontal com linha do tempo.
  // ---------------------------------------------------------------
  if (interactive) {
    return (
      <section id="trajetoria" className="relative overflow-hidden py-16">
        <div className="container-x flex h-full flex-col justify-center">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <SectionLabel n="03">Trajetória</SectionLabel>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                Onde eu <span className="text-gradient">construí</span> coisas.
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted">
              Da automação de robôs autônomos ao front-end de produtos reais. Role para
              percorrer a linha do tempo.
            </p>
          </div>

          {/* LINHA DO TEMPO */}
          <div className="relative mb-10 pt-2">
            <div className="absolute left-0 right-0 top-[1.15rem] h-px bg-line" />
            <div
              className="absolute left-0 top-[1.15rem] h-px bg-gradient-to-r from-violet to-emerald transition-[width] duration-700 ease-[cubic-bezier(0.83,0,0.17,1)]"
              style={{ width: `${progress}%` }}
            />
            <div className="relative flex justify-between">
              {ordered.map((it, i) => {
                const state = i < step ? "past" : i === step ? "current" : "future";
                const short = it.period.split(/[—→]/)[0].trim();
                return (
                  <button
                    key={i}
                    onClick={() => go(i, i >= step ? 1 : -1)}
                    className="group flex flex-col items-center gap-2 text-center"
                    aria-label={`Ir para ${it.role}`}
                  >
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border transition-all duration-500 ${
                        state === "current"
                          ? "scale-110 border-violet bg-bg shadow-[0_0_0_5px_rgb(var(--violet)/0.14)]"
                          : state === "past"
                          ? "border-emerald bg-bg"
                          : "border-line bg-bg"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                          state === "current"
                            ? "bg-violet"
                            : state === "past"
                            ? "bg-emerald"
                            : "bg-faint"
                        }`}
                      />
                    </span>
                    <span
                      className={`font-mono text-[10px] tabular-nums transition-colors duration-500 ${
                        state === "current" ? "text-violet" : "text-faint"
                      }`}
                    >
                      {String(i).padStart(2, "0")}
                    </span>
                    <span
                      className={`hidden font-mono text-[10px] tracking-wide transition-colors duration-500 sm:block ${
                        state === "future" ? "text-faint" : "text-muted"
                      }`}
                    >
                      {short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PALCO — slides horizontais */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.83,0,0.17,1)]"
              style={{ transform: `translate3d(-${step * 100}%, 0, 0)` }}
            >
              {ordered.map((it, i) => {
                const on = i === step;
                return (
                  <div key={i} className="w-full shrink-0 px-1">
                    <div
                      className={`relative grid gap-6 rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur-sm transition-all duration-700 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-9 ${
                        on ? "opacity-100 blur-0" : "opacity-40 blur-[1px]"
                      }`}
                      style={{
                        transform: on
                          ? "translateX(0)"
                          : `translateX(${dir === 1 ? 24 : -24}px)`,
                      }}
                    >
                      {/* Número gigante de fundo */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-5 top-2 select-none font-display text-[7rem] font-bold leading-none text-stroke opacity-[0.13] sm:text-[9rem]"
                      >
                        {String(i).padStart(2, "0")}
                      </span>

                      <div className="sm:pr-8">
                        <p className="mb-3 font-mono text-sm text-violet">{it.period}</p>
                        <h3 className="max-w-[12rem] font-display text-2xl font-semibold text-fg sm:text-3xl">
                          {it.role}
                        </h3>
                        <p className="mt-2 font-mono text-sm text-emerald">{it.company}</p>
                      </div>

                      <div className="relative z-10">
                        <ul className="space-y-2.5">
                          {it.bullets.map((b, j) => (
                            <li
                              key={j}
                              className="flex gap-3 text-sm leading-relaxed text-muted"
                            >
                              <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-violet/70" />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {it.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONTADOR + CONTROLES */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-3xl font-semibold text-fg sm:text-4xl">
                {String(step).padStart(2, "0")}
              </span>
              <span className="text-sm text-faint">/ {String(last).padStart(2, "0")}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => go(step - 1, -1)}
                disabled={step === 0}
                aria-label="Anterior"
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => go(step + 1, 1)}
                disabled={step === last}
                aria-label="Próximo"
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------
  // MODO EMPILHADO (mobile / telas baixas / reduce-motion): timeline vertical.
  // ---------------------------------------------------------------
  return (
    <section id="trajetoria" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionLabel n="03">Trajetória</SectionLabel>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Onde eu <span className="text-gradient">construí</span> coisas.
          </h2>
          <p data-reveal className="max-w-sm text-muted">
            Da automação de robôs autônomos ao front-end de produtos reais. Uma linha do tempo.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-violet via-line to-transparent sm:left-[13rem]" />

          <div className="space-y-14">
            {ordered.map((it, i) => (
              <div
                key={i}
                data-reveal
                className="relative grid gap-4 sm:grid-cols-[13rem_1fr] sm:gap-12"
              >
                <span className="absolute left-0 top-2 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border border-violet bg-bg sm:left-[13rem]">
                  <span className={`h-1.5 w-1.5 rounded-full ${i === last ? "bg-emerald" : "bg-violet"}`} />
                </span>

                <div className="pl-8 sm:pl-0 sm:pr-12 sm:text-right">
                  <p className="font-mono text-sm text-violet">{it.period}</p>
                </div>

                <div className="pl-8 sm:pl-4">
                  <h3 className="text-xl font-semibold text-fg sm:text-2xl">{it.role}</h3>
                  <p className="mb-5 font-mono text-sm text-emerald">{it.company}</p>
                  <ul className="space-y-2.5">
                    {it.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-faint" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {it.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
