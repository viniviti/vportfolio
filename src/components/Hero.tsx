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
  const sideRef = useRef<Side>("center");
  const [side, setSide] = useState<Side>("center");

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const ns: Side = x < 0.45 ? "left" : x > 0.55 ? "right" : "center";
      if (ns !== sideRef.current) {
        sideRef.current = ns;
        setSide(ns);
      }
    };
    const onLeave = () => {
      sideRef.current = "center";
      setSide("center");
    };

    if (!reduce) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);

      const q = gsap.utils.selector(section);
      gsap.set(q("[data-intro]"), { opacity: 0, y: 26 });
      gsap.set(frame, { opacity: 0, scale: 0.94, filter: "blur(6px)" });
      const tl = gsap.timeline({ delay: 1.45 });
      tl.to(frame, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" })
        .to(q("[data-intro]"), { opacity: 1, y: 0, duration: 0.85, stagger: 0.07, ease: "power3.out" }, "-=0.8");
    }

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const leftOn = side === "left";
  const rightOn = side === "right";
  const splitPct = leftOn ? 66 : rightOn ? 34 : 50;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[22%] h-[38vmax] w-[38vmax] rounded-full bg-violet/20 blur-[90px] animate-blob" />
        <div
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
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
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

          <div className="order-1 mx-auto lg:order-2">
            <div className="relative">
              <div
                ref={frameRef}
                className="relative h-[24rem] w-72 overflow-hidden rounded-[1.6rem] rounded-t-[9rem] border border-line bg-surface shadow-[0_40px_120px_-40px_rgb(var(--violet)/0.5)] sm:h-[30rem] sm:w-[22rem]"
              >
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.portraitUrl}
                    alt={`Retrato de ${hero.name}`}
                    className="absolute inset-0 h-full w-full object-cover object-top grayscale-[0.55]"
                  />
                  <div className="absolute inset-0 bg-emerald/15 mix-blend-color" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-3 text-right font-mono text-[9px] leading-relaxed text-emerald/50">
                    <div>&lt;html&gt;</div>
                    <div>class=&quot;dev&quot;</div>
                    <div>const clean = true;</div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 overflow-hidden transition-[clip-path] duration-700 ease-out"
                  style={{ clipPath: `polygon(0 0, ${splitPct}% 0, ${splitPct}% 100%, 0% 100%)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.portraitUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-violet/25 mix-blend-color" />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet/40 via-transparent to-transparent" />
                </div>

                <div
                  className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-violet via-violet/40 to-emerald shadow-[0_0_20px_rgb(var(--violet)/0.8)] transition-[left] duration-700 ease-out"
                  style={{ left: `${splitPct}%`, transform: "translateX(-1px)" }}
                />
              </div>

              <div className="absolute -right-5 -top-5 z-20 h-20 w-20 animate-float sm:-right-7 sm:h-24 sm:w-24">
                <div className="glass rounded-[1.4rem] p-1.5 shadow-lg">
                  <FollowEyes className="h-full w-full" />
                </div>
              </div>

              <div className="absolute -left-10 top-1/3 hidden rotate-[-90deg] font-mono text-[10px] uppercase tracking-[0.4em] text-faint lg:block">
                Front-End Dev
              </div>
            </div>
          </div>

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

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">scroll</span>
        <span className="h-10 w-px overflow-hidden bg-line">
          <span className="block h-4 w-full animate-[float_1.8s_ease-in-out_infinite] bg-violet" />
        </span>
      </div>
    </section>
  );
}