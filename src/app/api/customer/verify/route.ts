import { NextResponse } from "next/server";
import { customerVerifySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { verifyLoginCode } from "@/lib/login-code";
import { customerToken } from "@/lib/auth-token";

const CUSTOMER_COOKIE = "mv_customer";

// Step 2 of customer login: verify the one-time code and issue the session.
export async function POST(req: Request) {
  if (!rateLimit(req, "customer-verify", 10, 60_000)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const parsed = customerVerifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz kod." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();

  if (!(await verifyLoginCode(email, parsed.data.code))) {
    return NextResponse.json({ error: "Kod hatalı veya süresi dolmuş." }, { status: 401 });
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
