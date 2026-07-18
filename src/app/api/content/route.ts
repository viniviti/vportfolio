import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { isAuthed } from "@/lib/adminGuard";
import { isSupabaseWritable } from "@/lib/supabase";
import type { SiteContent } from "@/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const content = await getContent();
  return NextResponse.json({ content, writable: isSupabaseWritable });
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseWritable) {
    return NextResponse.json(
      {
        error:
          "Supabase não está configurado para escrita. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.",
      },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.content) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  try {
    await saveContent(body.content as SiteContent);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
