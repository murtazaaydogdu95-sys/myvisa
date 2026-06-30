import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerLoginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { issueLoginCode } from "@/lib/login-code";

const CUSTOMER_COOKIE = "mv_customer";

// Step 1 of customer login: request a one-time code by email. Verifying the
// code (and issuing the session cookie) happens in /api/customer/verify.
// Always returns a generic response so this can't enumerate which emails have
// applications (F-07).
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

  // Only issue a code if an application actually exists — but respond identically.
  const app = await prisma.application.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (app) {
    await issueLoginCode(email);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
