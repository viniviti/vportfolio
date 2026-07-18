import type { SiteContent } from "@/types/content";
import { defaultContent } from "@/lib/defaultContent";
import { getAnonClient, getServiceClient } from "@/lib/supabase";

const ROW_ID = "main";

/** Merge de 1 nível para os objetos aninhados, com arrays substituídos por inteiro. */
function mergeContent(base: SiteContent, over?: Partial<SiteContent> | null): SiteContent {
  if (!over) return base;
  return {
    meta: { ...base.meta, ...over.meta },
    social: { ...base.social, ...over.social },
    hero: { ...base.hero, ...over.hero },
    about: {
      ...base.about,
      ...over.about,
      education: { ...base.about.education, ...(over.about?.education ?? {}) },
    },
    experience: over.experience ?? base.experience,
    skills: over.skills ?? base.skills,
    softSkills: over.softSkills ?? base.softSkills,
    languages: over.languages ?? base.languages,
    certificates: over.certificates ?? base.certificates,
    projects: over.projects ?? base.projects,
    contact: { ...base.contact, ...over.contact },
  };
}

/** Conteúdo do site: Supabase se disponível, senão o padrão (currículo real). */
export async function getContent(): Promise<SiteContent> {
  const supabase = getAnonClient();
  if (!supabase) return defaultContent;
  try {
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error || !data?.data) return defaultContent;
    return mergeContent(defaultContent, data.data as Partial<SiteContent>);
  } catch {
    return defaultContent;
  }
}

/** Salva o conteúdo completo (usado pelo painel admin, via service role). */
export async function saveContent(content: SiteContent): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) throw new Error("Supabase service role não configurado.");
  const { error } = await supabase
    .from("content")
    .upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
