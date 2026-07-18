"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { HeroContent } from "@/types/content";
import { scrollToId } from "@/lib/sections";
import FollowEyes from "./FollowEyes";
import { ArrowIcon } from "./SocialIcons";

type Side = "left" | "right" | "center";

export default function Hero({ hero }: { hero: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<Side>("center");
  const [side, setSide] = useState<Side>("center");

  const st = useRef({ px: 0, py: 0, split: 0.5, tpx: 0, tpy: 0, tsplit: 0.5 });

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!section || !frame || !inner) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layers = Array.from(section.querySelectorAll<HTMLElement>("[data-depth]"));

    let raf = 0;
    const loop = () => {
      const s = st.current;
      s.px += (s.tpx - s.px) * 0.07;
      s.py += (s.tpy - s.py) * 0.07;
      s.split += (s.tsplit - s.split) * 0.08;
      frame.style.setProperty("--split", s.split.toFixed(4));
      inner.style.transform = `rotateY(${s.px * 6}deg) rotateX(${-s.py * 6}deg) translate3d(${s.px * 6}px, ${s.py * 6}px, 0)`;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth || "10");
        l.style.transform = `translate3d(${s.px * d}px, ${s.py * d}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };

    // Faixa segura do divisor: nunca cobre 100% do quadro nem o
    // personagem flutuante no canto — mantém sempre as duas metades visíveis.
    const SPLIT_MIN = 0.22;
    const SPLIT_MAX = 0.78;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      st.current.tpx = (x - 0.5) * 2;
      st.current.tpy = (y - 0.5) * 2;

      // O divisor acompanha o cursor de forma contínua (relativo ao quadro
      // do retrato), mas sempre travado entre SPLIT_MIN e SPLIT_MAX.
      const frameRect = frame.getBoundingClientRect();
      const fx = (e.clientX - frameRect.left) / frameRect.width;
      const eased = 0.5 + (fx - 0.5) * 0.9;
      st.current.tsplit = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, eased));

      const ns: Side = x < 0.45 ? "left" : x > 0.55 ? "right" : "center";
      if (ns !== sideRef.current) {
        sideRef.current = ns;
        setSide(ns);
      }
    };
    const onLeave = () => {
      st.current.tpx = 0;
      st.current.tpy = 0;
      st.current.tsplit = 0.5;
      sideRef.current = "center";
      setSide("center");
    };

    if (!reduce) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
      loop();

      const q = gsap.utils.selector(section);
      gsap.set(q("[data-intro]"), { opacity: 0, y: 26 });
      gsap.set(frame, { opacity: 0, scale: 0.94, filter: "blur(6px)" });
      const tl = gsap.timeline({ delay: 1.45 });
      tl.to(frame, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" })
        .to(q("[data-intro]"), { opacity: 1, y: 0, duration: 0.85, stagger: 0.07, ease: "power3.out" }, "-=0.8");
    }

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const leftOn = side === "left";
  const rightOn = side === "right";

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28"
    >
      {/* Fundo: blobs + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          data-depth="18"
          className="absolute left-[8%] top-[22%] h-[38vmax] w-[38vmax] rounded-full bg-violet/20 blur-[90px] animate-blob"
        />
        <div
          data-depth="26"
          className="absolute right-[6%] bottom-[10%] h-[32vmax] w-[32vmax] rounded-full bg-emerald/15 blur-[90px] animate-blob"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--line)/0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)/0.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
          }}
        />
      </div>

      <div className="container-x">
        {/* Palco central */}
        <div className="perspective relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          {/* Coluna esquerda — designer */}
          <div
            className={`order-2 text-center transition-all duration-500 lg:order-1 lg:-translate-y-6 lg:text-right ${
              rightOn ? "opacity-35 blur-[1px]" : "opacity-100"
            }`}
          >
            <h2
              data-intro
              className={`font-display text-6xl font-bold leading-[0.9] tracking-tightest transition-colors duration-300 sm:text-7xl ${
                leftOn ? "text-violet" : "text-fg"
              }`}
            >
              designer
            </h2>
            <p data-intro className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-muted lg:ml-auto lg:mr-0">
              {hero.leftText}
            </p>
          </div>

          {/* Retrato split */}
          <div className="order-1 mx-auto lg:order-2">
            <div className="relative">
              <div
                ref={frameRef}
                className="relative h-[24rem] w-72 overflow-hidden rounded-[1.6rem] rounded-t-[9rem] border border-line bg-surface shadow-[0_40px_120px_-40px_rgb(var(--violet)/0.5)] sm:h-[30rem] sm:w-[22rem]"
                style={{ "--split": 0.5 } as React.CSSProperties}
              >
                <div ref={innerRef} className="absolute inset-0 preserve-3d">
                  {/* metade esquerda (designer / colorido) */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: "calc(var(--split) * 100%)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.portraitUrl}
                      alt=""
                      className="absolute inset-y-0 left-0 h-full w-72 max-w-none object-cover object-top sm:w-[22rem]"
                    />
                    <div className="absolute inset-0 bg-violet/25 mix-blend-color" />
                    <div className="absolute inset-0 bg-gradient-to-t from-violet/40 via-transparent to-transparent" />
                  </div>
                  {/* metade direita (front-end / mono) */}
                  <div
                    className="absolute inset-y-0 right-0 overflow-hidden"
                    style={{ width: "calc((1 - var(--split)) * 100%)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.portraitUrl}
                      alt={`Retrato de ${hero.name}`}
                      className="absolute inset-y-0 right-0 h-full w-72 max-w-none object-cover object-top grayscale-[0.55] sm:w-[22rem]"
                    />
                    <div className="absolute inset-0 bg-emerald/15 mix-blend-color" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                    {/* linhas de código faint */}
                    <div className="absolute bottom-4 right-3 text-right font-mono text-[9px] leading-relaxed text-emerald/50">
                      <div>&lt;html&gt;</div>
                      <div>class=&quot;dev&quot;</div>
                      <div>const clean = true;</div>
                    </div>
                  </div>
                  {/* divisor */}
                  <div
                    className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-violet via-violet/40 to-emerald shadow-[0_0_20px_rgb(var(--violet)/0.8)]"
                    style={{ left: "calc(var(--split) * 100%)", transform: "translateX(-1px)" }}
                  />
                </div>
              </div>

              {/* personagem que olha pro cursor */}
              <div data-depth="34" className="absolute -right-5 -top-5 z-20 h-20 w-20 animate-float sm:-right-7 sm:h-24 sm:w-24">
                <div className="glass rounded-[1.4rem] p-1.5 shadow-lg">
                  <FollowEyes className="h-full w-full" />
                </div>
              </div>

              {/* etiqueta rotacionada */}
              <div
                data-depth="14"
                className="absolute -left-10 top-1/3 hidden rotate-[-90deg] font-mono text-[10px] uppercase tracking-[0.4em] text-faint lg:block"
              >
                Front-End Dev
              </div>
            </div>
          </div>

          {/* Coluna direita — front-end */}
          <div
            className={`order-3 text-center transition-all duration-500 lg:translate-y-8 lg:text-left ${
              leftOn ? "opacity-35 blur-[1px]" : "opacity-100"
            }`}
          >
            <h2
              data-intro
              className={`font-mono text-5xl font-bold leading-[0.9] tracking-tight transition-colors duration-300 sm:text-6xl ${
                rightOn ? "text-emerald" : "text-fg"
              }`}
            >
              <span className="text-faint">&lt;</span>
              front-end
              <span className="text-faint">/&gt;</span>
            </h2>
            <p data-intro className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-muted lg:mx-0">
              {hero.rightText}
            </p>
          </div>
        </div>

        {/* Assinatura + CTAs */}
        <div className="mt-14 flex flex-col items-center gap-6">
          <div data-intro className="text-center">
            <p className="eyebrow mb-2 inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              Portfólio de
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              {hero.name}
            </h1>
            {hero.availableBadge ? (
              <p className="mt-1.5 font-mono text-[11px] text-muted">{hero.availableBadge}</p>
            ) : null}
          </div>
          <div data-intro className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => scrollToId("projetos")}
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              Ver projetos
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => scrollToId("contato")}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-violet hover:text-violet"
            >
              Fale comigo
            </button>
          </div>
        </div>
      </div>

      {/* dica de scroll */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">scroll</span>
        <span className="h-10 w-px overflow-hidden bg-line">
          <span className="block h-4 w-full animate-[float_1.8s_ease-in-out_infinite] bg-violet" />
        </span>
      </div>
    </section>
  );
}
