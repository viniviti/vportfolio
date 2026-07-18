import type { ContactContent, SocialLinks } from "@/types/content";
import {
  ArrowIcon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "./SocialIcons";

export default function Contact({
  contact,
  social,
}: {
  contact: ContactContent;
  social: SocialLinks;
}) {
  const links = [
    { href: social.whatsapp, label: "WhatsApp", Icon: WhatsappIcon, ext: true },
    { href: social.github, label: "GitHub", Icon: GithubIcon, ext: true },
    { href: social.linkedin, label: "LinkedIn", Icon: LinkedinIcon, ext: true },
    { href: social.facebook, label: "Facebook", Icon: FacebookIcon, ext: true },
  ];

  return (
    <section id="contato" className="relative overflow-hidden py-28 sm:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[42vmax] w-[42vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 h-[24vmax] w-[24vmax] rounded-full bg-emerald/10 blur-[90px]" />
      </div>

      <div className="container-x text-center">
        <div data-reveal className="mb-6 flex items-center justify-center gap-4">
          <span className="font-mono text-xs text-violet">07</span>
          <span className="h-px w-10 bg-line" />
          <span className="eyebrow">Contato</span>
        </div>

        <h2
          data-reveal
          className="mx-auto max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tightest sm:text-7xl"
        >
          {contact.heading}
        </h2>

        <p data-reveal className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
          {contact.subheading}
        </p>

        <a
          href={`mailto:${social.email}`}
          data-reveal
          className="group mt-10 inline-flex items-center gap-3 font-display text-2xl font-medium tracking-tight text-fg sm:text-4xl"
        >
          <span className="link-underline">{social.email}</span>
          <ArrowIcon className="h-6 w-6 text-violet transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>

        <div data-reveal className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-line px-5 py-3 text-sm text-muted transition-all hover:-translate-y-0.5 hover:border-violet hover:text-fg"
            >
              <Icon className="h-[18px] w-[18px] transition-colors group-hover:text-violet" />
              {label}
            </a>
          ))}
        </div>

        <div
          data-reveal
          className="mt-14 flex flex-col items-center gap-1 font-mono text-xs text-muted"
        >
          <span>{contact.location}</span>
          <span className="text-faint">{contact.availability}</span>
        </div>
      </div>
    </section>
  );
}
