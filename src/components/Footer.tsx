import type { MetaContent, SocialLinks } from "@/types/content";
import { GithubIcon, LinkedinIcon, FacebookIcon, MailIcon } from "./SocialIcons";

export default function Footer({
  meta,
  social,
  name,
  location,
}: {
  meta: MetaContent;
  social: SocialLinks;
  name: string;
  location: string;
}) {
  return (
    <footer className="border-t border-line py-14">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
          <div>
            <a href="#inicio" className="flex items-baseline gap-1 font-display text-2xl font-bold tracking-tightest">
              <span className="text-fg">{meta.initials}</span>
              <span className="text-violet">.</span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Desenvolvedor Front-End · {location}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a href={social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-fg">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-fg">
              <LinkedinIcon className="h-[18px] w-[18px]" />
            </a>
            <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-fg">
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
            <a href={`mailto:${social.email}`} aria-label="E-mail" className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-fg">
              <MailIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center">
          <span>© 2026 {name}. Feito com Next.js, GSAP &amp; muito café.</span>
          <a href="#inicio" className="font-mono transition-colors hover:text-violet">
            voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
