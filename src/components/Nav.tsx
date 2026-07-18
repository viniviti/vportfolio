"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, scrollToId } from "@/lib/sections";
import type { SocialLinks } from "@/types/content";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from "./SocialIcons";

export default function Nav({
  initials,
  social,
}: {
  initials: string;
  social: SocialLinks;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  // Trava o scroll do body e fecha com ESC quando o menu mobile está aberto.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // pequeno delay para o overlay começar a fechar antes do scroll
    window.setTimeout(() => scrollToId(id), 80);
  };

  const socialItems = [
    { key: "github", label: "GitHub", href: social.github, Icon: GithubIcon },
    { key: "linkedin", label: "LinkedIn", href: social.linkedin, Icon: LinkedinIcon },
    { key: "whatsapp", label: "WhatsApp", href: social.whatsapp, Icon: WhatsappIcon },
    { key: "email", label: "E-mail", href: `mailto:${social.email}`, Icon: MailIcon },
  ].filter((i) => !!i.href);

  return (
    <>
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

          {/* Ações — desktop */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <button
              onClick={() => scrollToId("contato")}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-2 font-mono text-[12px] lowercase tracking-wide text-fg transition-colors hover:border-violet hover:text-violet"
            >
              contato
            </button>
          </div>

          {/* Ações — mobile: toggle de tema + botão de menu (hambúrguer/X) */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/60 text-fg transition-colors hover:border-violet/60"
            >
              <span className="relative block h-[14px] w-[18px]">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                    open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay do menu mobile */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-bg/90 backdrop-blur-xl transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute inset-x-0 top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-7 pb-10 pt-28 transition-all duration-500 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
                className={`group flex items-center justify-between border-b border-line py-4 text-left transition-all duration-500 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
              >
                <span className="font-display text-3xl font-semibold tracking-tightest text-fg transition-colors group-hover:text-violet">
                  {s.label}
                </span>
                <span className="font-mono text-[11px] text-faint transition-colors group-hover:text-emerald">
                  {s.n}
                </span>
              </button>
            ))}
          </nav>

          <div
            className={`flex flex-col gap-6 transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? "380ms" : "0ms" }}
          >
            {socialItems.length > 0 && (
              <div className="flex items-center gap-3">
                {socialItems.map(({ key, label, href, Icon }) => (
                  
                    key={key}
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/60 text-muted transition-colors hover:border-violet/60 hover:text-violet"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}

            <button
              onClick={() => go("contato")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg"
            >
              Fale comigo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}