import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdmin, readCustomer } from "@/lib/auth-token";

// Two cookie-based gates with styled login pages, using HMAC-signed tokens:
//  - /admin/*     → admin token (env ADMIN_USER/ADMIN_PASSWORD), login at /admin/login
//  - /dashboard/* → customer token (email login), login at /login
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // ── Admin gate ── (fails CLOSED: no password configured ⇒ never authed)
  if (pathname.startsWith("/admin")) {
    const user = process.env.ADMIN_USER || "admin";
    const pass = process.env.ADMIN_PASSWORD || "";
    const authed = !!pass && (await verifyAdmin(req.cookies.get("mv_admin")?.value, user));
    if (pathname === "/admin/login") return authed ? redirectTo("/admin") : NextResponse.next();
    return authed ? NextResponse.next() : redirectTo("/admin/login");
  }

  // ── Customer gate ──
  if (pathname === "/login" || pathname.startsWith("/dashboard")) {
    const authed = !!(await readCustomer(req.cookies.get("mv_customer")?.value));
    if (pathname === "/login") return authed ? redirectTo("/dashboard") : NextResponse.next();
    return authed ? NextResponse.next() : redirectTo("/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
