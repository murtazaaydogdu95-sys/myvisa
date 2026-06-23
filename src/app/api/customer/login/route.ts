import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerLoginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { customerToken } from "@/lib/auth-token";

// Demo-grade customer auth: log in with the email used on an application.
// Cookie value = base64(lowercased email); the dashboard reads it to scope data.
const CUSTOMER_COOKIE = "mv_customer";

export async function POST(req: Request) {
  if (!rateLimit(req, "customer-login", 8, 60_000)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = customerLoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();

  const app = await prisma.application.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (!app) {
    return NextResponse.json(
      { error: "Bu e-posta ile kayıtlı bir başvuru bulunamadı." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, await customerToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
