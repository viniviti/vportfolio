import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me-please"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protege /admin/* exceto a própria tela de login.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("pf_admin")?.value;
    let ok = false;
    if (token) {
      try {
        await jwtVerify(token, secret);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
