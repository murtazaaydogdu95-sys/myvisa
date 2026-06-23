import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, readCustomer } from "@/lib/auth-token";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { application: { select: { email: true } } },
  });
  if (!doc || !doc.data) return new NextResponse("Not found", { status: 404 });

  // Authorize: admin, or the customer who owns the application.
  const jar = await cookies();
  const isAdmin = await verifyAdmin(jar.get("mv_admin")?.value, process.env.ADMIN_USER || "admin");
  const customerEmail = await readCustomer(jar.get("mv_customer")?.value);
  const isOwner =
    !!customerEmail && customerEmail.toLowerCase() === doc.application.email.toLowerCase();
  if (!isAdmin && !isOwner) return new NextResponse("Forbidden", { status: 403 });

  return new NextResponse(new Uint8Array(doc.data), {
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(doc.name)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
