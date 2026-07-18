"use client";

import type { ReactNode } from "react";

export default function Marquee({
  children,
  reverse = false,
  className = "",
  speed = "normal",
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  speed?: "normal" | "slow";
}) {
  const anim = speed === "slow" ? "animate-marquee-slow" : "animate-marquee";
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className={`flex shrink-0 ${anim} items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused] ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
