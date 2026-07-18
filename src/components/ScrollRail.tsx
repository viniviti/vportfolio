"use client";

import { useEffect, useState } from "react";
import { SECTIONS, scrollToId } from "@/lib/sections";

export default function ScrollRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onChange = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index;
      if (typeof idx === "number") setActive(idx);
    };
    window.addEventListener("section:change", onChange);

    // Fallback para quando o snap-scroll está desativado (mobile/telas baixas).
    const ids = SECTIONS.map((s) => s.id);
    const io = new IntersectionObserver(
      (entries) => {
        if (window.__snapEnabled) return;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf((e.target as HTMLElement).id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("section:change", onChange);
      io.disconnect();
    };
  }, []);

  return (
    <div className="fixed right-5 top-1/2 z-[65] hidden -translate-y-1/2 lg:block">
      <div className="flex flex-col items-end gap-4">
        {SECTIONS.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              onClick={() => scrollToId(s.id)}
              className="group flex items-center justify-end gap-3"
              aria-label={`Ir para ${s.label}`}
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  on ? "translate-x-0 text-muted opacity-100" : "-translate-x-2 text-faint opacity-0 group-hover:opacity-60"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`font-mono text-[11px] tabular-nums transition-colors ${
                  on ? "text-violet" : "text-faint group-hover:text-muted"
                }`}
              >
                {s.n}
              </span>
              <span
                className={`h-[1.5px] rounded-full transition-all duration-300 ${
                  on ? "w-7 bg-violet" : "w-3 bg-line group-hover:w-5 group-hover:bg-muted"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
