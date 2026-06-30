import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { readCustomer } from "@/lib/auth-token";
import { payBalanceSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { makeTxn, formatDay } from "@/lib/format";

// Customer pays the (mocked) balance payment for their own application.
export async function POST(req: Request) {
  if (!rateLimit(req, "pay-balance", 20, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }
  const email = await readCustomer((await cookies()).get("mv_customer")?.value);
  if (!email) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const parsed = payBalanceSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const payment = await prisma.payment.findUnique({
    where: { id: parsed.data.paymentId },
    include: { application: { select: { id: true, email: true } } },
  });

  // Ownership + state checks.
  if (!payment || payment.application.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }
  if (payment.kind !== "balance" || payment.status !== "pending") {
    return NextResponse.json({ error: "Bu ödeme yapılamaz." }, { status: 400 });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "paid", txn: makeTxn(), paidOn: formatDay() },
  });
  // Both deposit and balance paid → application fully paid.
  await prisma.application.update({ where: { id: payment.application.id }, data: { status: "Paid" } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
