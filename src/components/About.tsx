import Image from "next/image";
import type { AboutContent } from "@/types/content";
import SectionLabel from "./SectionLabel";

export default function About({ about }: { about: AboutContent }) {
  return (
    <section id="sobre" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionLabel n="02">Quem constrói</SectionLabel>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          {/* Foto assimétrica */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm" data-reveal>
            <div className="absolute -inset-5 -z-10 rounded-[2.2rem] bg-gradient-to-br from-violet/30 to-emerald/20 blur-3xl" />
            <div className="relative aspect-[4/5] rotate-[-2.5deg] overflow-hidden rounded-[1.6rem] border border-line">
              <Image
                src={about.photoUrl}
                alt={`Foto de ${about.education.course}`}
                fill
                sizes="(max-width: 768px) 80vw, 380px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
            </div>
            <div
              data-reveal
              className="absolute -bottom-5 -right-3 rotate-[3deg] rounded-2xl border border-line bg-surface px-4 py-3 font-mono text-xs text-muted shadow-xl"
            >
              <span className="text-emerald">◆</span> {about.education.period}
            </div>
            <div
              data-reveal
              className="absolute -left-4 top-6 -rotate-[4deg] rounded-full border border-violet/40 bg-bg px-3 py-1 font-mono text-[10px] text-violet shadow-lg"
            >
              hello world
            </div>
          </div>

          {/* Texto editorial */}
          <div>
            <h2
              data-reveal
              className="max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-[2.6rem]"
            >
              Uma parte <span className="text-gradient">constrói com lógica</span>, a outra cuida de cada pixel da interface.
            </h2>

            <div className="mt-8 max-w-xl space-y-5">
              {about.paragraphs.map((p, i) => (
                <p key={i} data-reveal className="leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div data-reveal className="border-l-2 border-violet pl-5">
                <p className="eyebrow mb-2">Formação</p>
                <p className="font-medium text-fg">{about.education.course}</p>
                <p className="text-sm text-muted">{about.education.place}</p>
              </div>
              <div data-reveal className="border-l-2 border-emerald pl-5">
                <p className="eyebrow mb-2">Base &amp; disponibilidade</p>
                <p className="font-medium text-fg">{about.location}</p>
                <p className="text-sm leading-relaxed text-muted">{about.availability}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
