"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/sections";

// Trava de transição — evita "correr" por várias seções em um só gesto.
const LOCK_MS = 620;

export default function SnapScroll({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  // Snap de tela fixa só faz sentido com altura suficiente para o conteúdo
  // (desktop / notebooks). Em telas pequenas mantemos o scroll natural.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 620px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => setEnabled(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    setReady(true);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    window.__snapEnabled = enabled;
    document.documentElement.classList.toggle("snap-active", enabled);
    document.body.style.overflow = enabled ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [enabled]);

  const emit = (index: number) => {
    window.dispatchEvent(
      new CustomEvent("section:change", { detail: { index, id: SECTIONS[index]?.id } })
    );
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const total = SECTIONS.length;
    const next = Math.max(0, Math.min(total - 1, i));
    indexRef.current = next;
    track.style.transform = `translate3d(0, -${next * 100}svh, 0)`;
    emit(next);
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, LOCK_MS);
  };

  // Um "passo" de scroll. Antes de trocar de seção, oferece o gesto à seção
  // atual (via __snapStepGuard). Se ela consumir (ex.: avançar uma trajetória
  // no slider horizontal), apenas travamos brevemente e não trocamos de tela.
  const step = (dir: number) => {
    const guard = window.__snapStepGuards?.[indexRef.current];
    if (guard && guard(dir)) {
      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, LOCK_MS);
      return;
    }
    goTo(indexRef.current + dir);
  };

  useEffect(() => {
    window.__snapGoTo = (i: number) => {
      if (!enabled) {
        const id = SECTIONS[i]?.id;
        const el = id ? document.getElementById(id) : null;
        el?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      goTo(i);
    };
    window.__snapGoToId = (id: string) => {
      const i = SECTIONS.findIndex((s) => s.id === id);
      if (i < 0) return;
      window.__snapGoTo?.(i);
    };
    return () => {
      window.__snapGoTo = undefined;
      window.__snapGoToId = undefined;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Reafirma o slide atual (evita saltos ao ligar/desligar o modo)
    goTo(indexRef.current);

    let touchStartY = 0;
    let touchStartX = 0;
    let wheelAccum = 0;
    let wheelResetTimer = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockRef.current) return;
      wheelAccum += e.deltaY;
      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelAccum = 0;
      }, 140);
      const THRESHOLD = 42;
      if (Math.abs(wheelAccum) < THRESHOLD) return;
      step(wheelAccum > 0 ? 1 : -1);
      wheelAccum = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      // Impede o "bounce" nativo do navegador durante o gesto vertical
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      if (dy > dx) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (lockRef.current) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dy) < 56 || Math.abs(dy) < Math.abs(dx)) return;
      step(dy > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (lockRef.current) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(wheelResetTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Dispara a revelação inicial assim que o layout está pronto.
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => emit(0), 60);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <div
      ref={wrapRef}
      className={enabled ? "fixed inset-0 z-0 overflow-hidden" : "relative"}
    >
      <div
        ref={trackRef}
        className={enabled ? "snap-track" : ""}
        style={enabled ? { transform: "translate3d(0,0,0)" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
