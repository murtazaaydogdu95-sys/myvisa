import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/AdminShell";
import { AdminCustomers, type Customer } from "@/components/AdminCustomers";
import { initials } from "@/lib/format";
import { formatEuroCents } from "@/lib/data";
import { refundApplication } from "./actions";
import { requireAdminPage } from "@/lib/admin-auth";

export const metadata = { title: "Müşteriler — Yönetim" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminPage();
  const rows = await prisma.application.findMany({
    where: { isDemo: false },
    orderBy: { createdAt: "desc" },
  });

  const customers: Customer[] = rows.map((c) => ({
    id: c.id,
    name: c.fullName,
    email: c.email,
    initials: initials(c.fullName),
    nationality: c.nationality,
    nationalityFlag: c.nationalityFlag,
    destination: c.destination,
    destinationFlag: c.destinationFlag,
    visa: c.visaType,
    plan: c.plan,
    amount: c.amount,
    govFee: c.govFee ?? "—",
    status: c.status,
    paidOn: c.paidOn ?? "—",
    ref: c.ref,
    txn: c.txn ?? "—",
    method: c.paymentMethod ?? "—",
    phone: c.phone ?? "—",
    passport: c.passport ?? "—",
    travelDate: c.travelDate ?? "—",
    duration: c.duration ?? "—",
  }));

  const customerCount = customers.length;
  const paidCount = customers.filter((c) => c.status === "Paid" || c.status === "DepositPaid").length;
  // Revenue = sum of payments actually collected (deposits + balances).
  const paidAgg = await prisma.payment.aggregate({
    where: { status: "paid", application: { isDemo: false } },
    _sum: { amountCents: true },
  });
  const revenue = formatEuroCents(paidAgg._sum.amountCents ?? 0);

  return (
    <AdminShell active="customers" title="Müşteriler" subtitle="Vize başvurusu için ödeme yapan herkes.">
      <div className="mv-statrow" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <Stat label="Toplam müşteri" value={String(customerCount)} />
        <Stat label="Ödenen başvurular" value={String(paidCount)} />
        <Stat label="Gelir (hizmet ücretleri)" value={revenue} accent />
      </div>
      <AdminCustomers customers={customers} refund={refundApplication} />
    </AdminShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
      <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent ? "#10b981" : "#0A1F3C", letterSpacing: "-.02em", marginTop: 4 }}>{value}</div>
    </div>
  );
}
