"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const d = document.documentElement;
    const toLight = !d.classList.contains("light");
    d.classList.toggle("light", toLight);
    d.classList.toggle("dark", !toLight);
    try {
      localStorage.setItem("theme", toLight ? "light" : "dark");
    } catch {
      /* ignore */
    }
    setLight(toLight);
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Ativar modo escuro" : "Ativar modo claro"}
      className={`group relative grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/60 text-fg transition-colors hover:border-violet/60 ${className}`}
    >
      <span className="relative h-[18px] w-[18px]">
        {/* Sol */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            mounted && light ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
        {/* Lua */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            mounted && !light ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          fill="currentColor"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>
    </button>
  );
}
