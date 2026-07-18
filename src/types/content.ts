// Modelo de dados de TODO o conteúdo editável do portfólio.
// Tudo aqui pode ser alterado pelo painel /admin (quando o Supabase estiver ligado).

export type ThemeMode = "dark" | "light";
export type Accent = "violet" | "emerald";
export type ProjectStatus = "live" | "soon";

export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook: string;
  email: string;
  whatsapp: string; // URL completa (wa.me/...)
  phoneLabel: string; // texto exibido, ex: "(35) 99817-8132"
}

export interface HeroContent {
  availableBadge: string;
  name: string;
  leftWord: string; // "designer"
  rightWord: string; // "front-end"
  leftText: string; // descrição do lado designer
  rightText: string; // descrição do lado dev
  portraitUrl: string;
  resumeUrl: string;
}

export interface EducationItem {
  course: string;
  place: string;
  period: string;
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  education: EducationItem;
  photoUrl: string;
  location: string;
  availability: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  tags: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface LanguageItem {
  flag: string;
  name: string;
  level: string;
}

export interface CertificateItem {
  title: string;
  issuer: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  status: ProjectStatus;
  year: string;
  accent: Accent;
}

export interface ContactContent {
  heading: string;
  subheading: string;
  location: string;
  availability: string;
}

export interface MetaContent {
  title: string;
  description: string;
  initials: string; // logo, ex: "VV"
}

export interface SiteContent {
  meta: MetaContent;
  social: SocialLinks;
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceItem[];
  skills: SkillGroup[];
  softSkills: string[];
  languages: LanguageItem[];
  certificates: CertificateItem[];
  projects: ProjectItem[];
  contact: ContactContent;
}
