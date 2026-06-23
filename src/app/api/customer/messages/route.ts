import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { readCustomer } from "@/lib/auth-token";
import { customerMessageSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(req, "customer-message", 20, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }
  const email = await readCustomer((await cookies()).get("mv_customer")?.value);
  if (!email) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const parsed = customerMessageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz mesaj." }, { status: 400 });

  // Ownership check.
  const app = await prisma.application.findFirst({
    where: { id: parsed.data.applicationId, email: { equals: email, mode: "insensitive" } },
    select: { id: true, fullName: true },
  });
  if (!app) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

  await prisma.message.create({
    data: {
      applicationId: app.id,
      who: `${app.fullName} (siz)`,
      when: "az önce",
      text: parsed.data.text,
      fromCustomer: true,
    },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
