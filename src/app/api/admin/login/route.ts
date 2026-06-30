import { NextResponse } from "next/server";
import { adminToken } from "@/lib/auth-token";
import { adminLoginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

const ADMIN_COOKIE = "mv_admin";

export async function POST(req: Request) {
  if (!rateLimit(req, "admin-login", 6, 60_000)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD || "";

  // Fail closed: with no admin password configured, login is disabled.
  if (!pass) {
    return NextResponse.json({ error: "Yönetim girişi yapılandırılmamış." }, { status: 503 });
  }
  if (!(parsed.data.user === user && parsed.data.password === pass)) {
    return NextResponse.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await adminToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
