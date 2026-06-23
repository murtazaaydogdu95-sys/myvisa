import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { Dashboard, type DashApp } from "@/components/Dashboard";
import { trCountry } from "@/lib/tr";
import { readCustomer } from "@/lib/auth-token";

export const metadata = { title: "Panelim — MyVisa" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Resolve the logged-in customer from the signed cookie (login / on apply).
  const email = await readCustomer((await cookies()).get("mv_customer")?.value);
  if (!email) redirect("/login");

  const rows = await prisma.application.findMany({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { documents: true, messages: true },
    orderBy: { createdAt: "desc" },
  });

  const apps: DashApp[] = rows.map((a) => ({
    id: a.id,
    ref: a.ref,
    title: a.title ?? `${trCountry(a.destination)} vizesi`,
    destination: a.destination,
    destinationFlag: a.destinationFlag,
    plan: a.plan,
    amount: a.amount,
    paidOn: a.paidOn ?? "",
    status: a.status,
    statusIndex: a.statusIndex,
    documents: a.documents.map((d) => ({ id: d.id, name: d.name, state: d.state, size: d.size ?? null })),
    messages: a.messages.map((m) => ({ who: m.who, when: m.when, text: m.text, fromCustomer: m.fromCustomer })),
  }));

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 67px)", background: "#F5F7FA" }}>
        <Dashboard apps={apps} email={email} />
      </main>
    </>
  );
}
