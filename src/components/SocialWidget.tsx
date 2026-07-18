"use client";

import { useEffect, useState } from "react";
import type { SocialLinks } from "@/types/content";
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from "./SocialIcons";

const CYCLE_MS = 45000;

export default function SocialWidget({
  social,
  name = "Vinícius Viti",
}: {
  social: SocialLinks;
  name?: string;
}) {
  const items = [
    { key: "github", label: "GitHub", href: social.github, Icon: GithubIcon },
    { key: "linkedin", label: "LinkedIn", href: social.linkedin, Icon: LinkedinIcon },
    { key: "whatsapp", label: "WhatsApp", href: social.whatsapp, Icon: WhatsappIcon },
    { key: "email", label: "E-mail", href: `mailto:${social.email}`, Icon: MailIcon },
  ].filter((i) => !!i.href);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length < 2) return;
    const tick = () => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 420);
    };
    const id = window.setInterval(tick, CYCLE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[index];
  const year = new Date().getFullYear();

  return (
    <>
      {/* Botão social flutuante — fechado (só ícone), abre no hover */}
      <div className="fixed bottom-6 right-6 z-[65] hidden lg:block">
        <a
          key={current.key}
          href={current.href}
          target={current.key === "email" ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={current.label}
          className={`group flex items-center rounded-full border border-line bg-surface/70 p-2 shadow-lg shadow-black/20 backdrop-blur transition-all duration-300 hover:border-violet/60 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg/[0.06] text-muted transition-colors group-hover:text-violet">
            <current.Icon className="h-4 w-4" />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[11px] text-muted opacity-0 transition-all duration-300 group-hover:max-w-[7rem] group-hover:pl-2.5 group-hover:pr-1.5 group-hover:text-fg group-hover:opacity-100">
            {current.label}
          </span>
        </a>
      </div>

      {/* Copyright (substitui o antigo "SIGA") */}
      <span className="fixed bottom-6 left-6 z-[60] hidden font-mono text-[10px] tracking-wide text-faint lg:block">
        © {year} {name} · Todos os direitos reservados
      </span>
    </>
  );
}
