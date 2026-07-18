export interface SectionDef {
  id: string;
  label: string;
  n: string;
}

// Ordem das seções (usada no trilho lateral, navegação por âncora e no snap-scroll).
export const SECTIONS: SectionDef[] = [
  { id: "inicio", label: "Início", n: "01" },
  { id: "sobre", label: "Sobre", n: "02" },
  { id: "trajetoria", label: "Trajetória", n: "03" },
  { id: "skills", label: "Skills", n: "04" },
  { id: "projetos", label: "Projetos", n: "05" },
  { id: "mais", label: "O que eu faço", n: "06" },
  { id: "contato", label: "Contato", n: "07" },
];

// Subconjunto exibido em listagens de navegação (mais enxuto).
export const NAV_LINKS: SectionDef[] = SECTIONS.filter((s) =>
  ["sobre", "trajetoria", "skills", "projetos", "contato"].includes(s.id)
);

export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  if (window.__snapGoToId) {
    window.__snapGoToId(id);
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}
