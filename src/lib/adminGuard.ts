import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySessionToken } from "./auth";

/** Verifica se a requisição atual tem sessão de admin válida. */
export async function isAuthed(): Promise<boolean> {
  const token = cookies().get(AUTH_COOKIE)?.value;
  return verifySessionToken(token);
}
