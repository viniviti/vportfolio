"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const el = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: MouseEvent) => {
      if (el.current) {
        el.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const active = !!t?.closest("a, button, [data-cursor], input, textarea");
      root.classList.toggle("cursor-active", active);
    };
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeave = () => root.classList.add("cursor-hidden");
    const onEnter = () => root.classList.remove("cursor-hidden");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-cursor", "cursor-active", "cursor-down", "cursor-hidden");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={el}
      className="pointer-events-none fixed left-0 top-0 z-[80] will-change-transform [html.cursor-hidden_&]:opacity-0"
    >
      {/* nível hover (cresce ao passar em links/botões) */}
      <div className="origin-top-left transition-transform duration-200 ease-out [html.cursor-active_&]:scale-[1.45]">
        {/* nível clique (encolhe ao pressionar) */}
        <div className="origin-top-left transition-transform duration-100 ease-out [html.cursor-down_&]:scale-[0.78]">
          <svg
            width="24"
            height="32"
            viewBox="0 0 14 20"
            className="text-violet transition-colors duration-200 [html.cursor-active_&]:text-emerald"
            style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.35))" }}
          >
            <path
              d="M0 0 L0 16.7 L4.06 12.9 L6.5 18.7 L8.7 17.8 L6.3 12.1 L11.6 12.1 Z"
              fill="currentColor"
              stroke="rgb(var(--bg))"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
