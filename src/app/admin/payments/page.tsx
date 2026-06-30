import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/AdminShell";
import { statusBadge, formatEuroCents } from "@/lib/data";
import { requireAdminPage } from "@/lib/admin-auth";

export const metadata = { title: "Ödemeler — Yönetim" };
export const dynamic = "force-dynamic";

const PAY_TR: Record<string, string> = { paid: "Ödendi", pending: "Beklemede", refunded: "İade edildi" };
const PAY_BADGE: Record<string, string> = { paid: "Paid", pending: "Pending", refunded: "Refunded" };

export default async function AdminPaymentsPage() {
  await requireAdminPage();
  const payments = await prisma.payment.findMany({
    where: { application: { isDemo: false } },
    include: { application: { select: { fullName: true, ref: true } } },
    orderBy: { createdAt: "desc" },
  });

  const paid = payments.filter((p) => p.status === "paid");
  const refunded = payments.filter((p) => p.status === "refunded");
  const revenue = formatEuroCents(paid.reduce((s, p) => s + p.amountCents, 0));
  const pendingTotal = formatEuroCents(
    payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amountCents, 0),
  );

  return (
    <AdminShell active="payments" title="Ödemeler" subtitle="Kapora ve bakiye işlemleri.">
      <div className="mv-statrow" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <Stat label="Tahsil edilen gelir" value={revenue} accent />
        <Stat label="Bekleyen bakiye" value={pendingTotal} />
        <Stat label="İade edilen işlem" value={String(refunded.length)} />
      </div>

      <div className="mv-table-scroll" style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, boxShadow: "0 1px 3px rgba(10,31,60,.05)", overflowX: "auto" }}>
        <div className="mv-table-inner" style={{ minWidth: 720 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.1fr 1fr 1.3fr 0.9fr", gap: 14, padding: "14px 22px", background: "#f8fafc", borderBottom: "1px solid #eef2f7", fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#94a3b8" }}>
            <div>Müşteri</div><div>Tür</div><div>Tutar</div><div>İşlem kimliği</div><div>Durum</div>
          </div>
          {payments.map((p) => {
            const badge = statusBadge[PAY_BADGE[p.status]] ?? statusBadge.Pending;
            return (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1.1fr 1fr 1.3fr 0.9fr", gap: 14, padding: "15px 22px", borderBottom: "1px solid #f1f5f9", alignItems: "center" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1F3C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.application.fullName}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{p.application.ref} · {p.paidOn ?? "—"}</div>
                </div>
                <div style={{ fontSize: 13.5, color: "#46566e" }}>{p.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0A1F3C" }}>{formatEuroCents(p.amountCents)}</div>
                <div style={{ fontSize: 13, color: "#64748b", fontFamily: "monospace" }}>{p.txn ?? "—"}</div>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: badge.bg, color: badge.fg, fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot }} />{PAY_TR[p.status] ?? p.status}
                  </span>
                </div>
              </div>
            );
          })}
          {payments.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "#64748b", fontSize: 14.5 }}>Henüz ödeme yok.</div>
          )}
        </div>
      </div>
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
