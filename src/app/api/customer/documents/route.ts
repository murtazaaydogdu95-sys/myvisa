import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { readCustomer } from "@/lib/auth-token";
import { customerDocumentSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(req, "customer-document", 20, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }
  const email = await readCustomer((await cookies()).get("mv_customer")?.value);
  if (!email) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const parsed = customerDocumentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz dosya." }, { status: 400 });

  const app = await prisma.application.findFirst({
    where: { id: parsed.data.applicationId, email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (!app) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

  const bytes = Buffer.from(parsed.data.dataBase64, "base64");
  if (bytes.length > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Dosya çok büyük (en fazla 5 MB)." }, { status: 413 });
  }

  await prisma.document.create({
    data: {
      applicationId: app.id,
      name: parsed.data.name,
      state: "In review",
      mimeType: parsed.data.mime ?? null,
      size: bytes.length,
      data: bytes,
      uploadedBy: "customer",
    },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
