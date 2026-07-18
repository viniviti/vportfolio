import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE = "pf_admin";

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET || "dev-insecure-secret-change-me-please";
  return new TextEncoder().encode(s);
}

export async function createSessionToken(username: string): Promise<string> {
  return await new SignJWT({ u: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/** Compara credenciais com as variáveis de ambiente (login do admin). */
export function checkCredentials(username: string, password: string): boolean {
  const U = process.env.ADMIN_USERNAME;
  const P = process.env.ADMIN_PASSWORD;
  if (!U || !P) return false;
  // Comparação de tempo aproximadamente constante.
  const a = `${username}:${password}`;
  const b = `${U}:${P}`;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
