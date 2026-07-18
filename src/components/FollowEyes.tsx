"use client";

import { useEffect, useRef } from "react";

// Personagem minimalista cujos olhos seguem o cursor (homenagem ao robbowen.digital).
const VBW = 120;
const VBH = 108;
const EYES = [
  { cx: 44, cy: 46 },
  { cx: 76, cy: 46 },
];
const MAX = 5;

export default function FollowEyes({ className = "" }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const pupils = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = svg.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      EYES.forEach((eye, i) => {
        const g = pupils.current[i];
        if (!g) return;
        const ex = rect.left + (eye.cx / VBW) * rect.width;
        const ey = rect.top + (eye.cy / VBH) * rect.height;
        const ang = Math.atan2(e.clientY - ey, e.clientX - ex);
        const d = Math.min(MAX, Math.hypot(e.clientX - ex, e.clientY - ey) / 22);
        g.setAttribute("transform", `translate(${Math.cos(ang) * d} ${Math.sin(ang) * d})`);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg ref={svg} viewBox={`0 0 ${VBW} ${VBH}`} className={className} aria-hidden>
      <defs>
        <linearGradient id="eyeStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--violet))" />
          <stop offset="1" stopColor="rgb(var(--emerald))" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width={VBW - 8}
        height={VBH - 8}
        rx="30"
        fill="rgb(var(--surface))"
        stroke="url(#eyeStroke)"
        strokeWidth="2"
      />
      {EYES.map((eye, i) => (
        <g key={i}>
          <circle cx={eye.cx} cy={eye.cy} r="12" fill="rgb(var(--bg))" />
          <g
            ref={(n) => {
              pupils.current[i] = n;
            }}
          >
            <circle cx={eye.cx} cy={eye.cy} r="5.5" fill="rgb(var(--fg))" />
            <circle cx={eye.cx - 1.6} cy={eye.cy - 1.6} r="1.4" fill="rgb(var(--bg))" />
          </g>
        </g>
      ))}
      <path
        d="M46 78 Q60 88 74 78"
        fill="none"
        stroke="rgb(var(--violet))"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
