"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader({ initials }: { initials: string }) {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    tl.to(counter, {
      v: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(".pl-bar", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
      .to(".pl-inner", { yPercent: -110, duration: 0.6, ease: "power3.inOut" }, "+=0.15")
      .to(root.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "-=0.35");

    // trava o scroll enquanto carrega
    document.documentElement.style.overflow = "hidden";
    const unlock = setTimeout(() => {
      document.documentElement.style.overflow = "";
    }, 2200);

    return () => {
      clearTimeout(unlock);
      document.documentElement.style.overflow = "";
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-end justify-between bg-bg px-6 pb-8 sm:px-10 lg:px-16"
      aria-hidden
    >
      <div className="pl-inner flex items-baseline gap-3">
        <span className="font-display text-4xl font-bold tracking-tightest text-fg sm:text-6xl">
          {initials}
        </span>
        <span className="font-mono text-xs text-violet">.dev</span>
      </div>
      <div className="pl-inner flex flex-col items-end gap-3">
        <span ref={countRef} className="font-mono text-2xl text-muted sm:text-4xl">
          000
        </span>
        <div className="h-px w-40 origin-left overflow-hidden bg-line sm:w-64">
          <div className="pl-bar h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-emerald" />
        </div>
      </div>
    </div>
  );
}
