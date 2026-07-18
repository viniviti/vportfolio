"use client";

import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/sections";
import ThemeToggle from "./ThemeToggle";

export default function Nav({ initials }: { initials: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onChange = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index;
      setScrolled(typeof idx === "number" ? idx > 0 : window.scrollY > 40);
    };
    const onScroll = () => {
      if (window.__snapEnabled) return;
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("section:change", onChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("section:change", onChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[75] transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`container-x flex items-center justify-between rounded-full transition-all duration-500 ${
          scrolled ? "glass border border-line py-2 pl-5 pr-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" : ""
        }`}
        style={scrolled ? { maxWidth: "1180px" } : undefined}
      >
        <button
          onClick={() => scrollToId("inicio")}
          className="flex items-baseline gap-1.5 font-display text-xl font-bold tracking-tightest"
        >
          <span className="text-fg">{initials}</span>
          <span className="text-violet">.</span>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => scrollToId("contato")}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 font-mono text-[12px] lowercase tracking-wide text-fg transition-colors hover:border-violet hover:text-violet sm:px-5"
          >
            contato
          </button>
        </div>
      </div>
    </header>
  );
}
