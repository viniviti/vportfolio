"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Anima todos os elementos [data-reveal] ao entrarem na viewport.
 * O CSS global os deixa invisíveis por padrão; aqui revelamos com stagger.
 * Fallback: se algo falhar, tudo vira visível após um tempo.
 */
export default function RevealManager() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");

    if (reduce) {
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const tweens: gsap.core.Tween[] = [];
    const revealed = new Set<HTMLElement>();

    // Fallback: scroll natural (mobile / telas baixas, onde o snap fica desativado).
    els.forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay || "0");
      const tw = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onStart: () => {
          revealed.add(el);
        },
      });
      tweens.push(tw);
    });

    // No modo snap-scroll a página não rola de verdade (as seções são
    // deslocadas via transform), então revelamos por seção ativa.
    const onSectionChange = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string | undefined;
      if (!id) return;
      const root = document.getElementById(id);
      if (!root) return;
      const scoped = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      scoped.forEach((el) => {
        if (revealed.has(el)) return;
        revealed.add(el);
        const delay = parseFloat(el.dataset.revealDelay || "0");
        gsap.to(el, { opacity: 1, y: 0, duration: 0.95, delay, ease: "power3.out", overwrite: "auto" });
      });
    };
    window.addEventListener("section:change", onSectionChange);

    // Segurança: garante visibilidade caso algum trigger não dispare.
    const safety = setTimeout(() => {
      els.forEach((el) => {
        if (getComputedStyle(el).opacity === "0") {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 4000);

    return () => {
      clearTimeout(safety);
      window.removeEventListener("section:change", onSectionChange);
      tweens.forEach((t) => t.scrollTrigger?.kill());
      gsap.killTweensOf(els);
    };
  }, []);

  return null;
}
