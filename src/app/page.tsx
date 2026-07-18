import { getContent } from "@/lib/content";
import SnapScroll from "@/components/SnapScroll";
import RevealManager from "@/components/RevealManager";
import CustomCursor from "@/components/CustomCursor";
import ScrollRail from "@/components/ScrollRail";
import SocialWidget from "@/components/SocialWidget";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Extras from "@/components/Extras";
import Contact from "@/components/Contact";

// Sempre renderiza fresco para refletir edições feitas no painel admin.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();

  return (
    <>
      <Preloader initials={c.meta.initials} />
      <RevealManager />
      <CustomCursor />
      <ScrollRail />
      <SocialWidget social={c.social} name={c.hero.name} />
      <Nav initials={c.meta.initials} />

      <SnapScroll>
        <Hero hero={c.hero} />
        <About about={c.about} />
        <Experience items={c.experience} />
        <Skills groups={c.skills} linkedin={c.social.linkedin} />
        <Projects projects={c.projects} github={c.social.github} />
        <Extras />
        <Contact contact={c.contact} social={c.social} />
      </SnapScroll>
    </>
  );
}
