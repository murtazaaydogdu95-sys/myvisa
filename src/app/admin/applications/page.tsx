import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/Icon";
import { flagUrl, statuses, statusBadge } from "@/lib/data";
import { trCountry, statusTR, statusesTR } from "@/lib/tr";

export const metadata = { title: "Başvurular — Yönetim" };
export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { documents: true } } },
  });

  return (
    <AdminShell active="applications" title="Başvurular" subtitle="Tüm vize başvuruları ve süreç durumları.">
      <div className="mv-table-scroll" style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, boxShadow: "0 1px 3px rgba(10,31,60,.05)", overflowX: "auto" }}>
        <div className="mv-table-inner" style={{ minWidth: 720 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.8fr 1.4fr 1.4fr 0.9fr 32px", gap: 14, padding: "14px 22px", background: "#f8fafc", borderBottom: "1px solid #eef2f7", fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#94a3b8" }}>
            <div>Referans</div><div>Müşteri</div><div>Destinasyon</div><div>Aşama</div><div>Ödeme</div><div />
          </div>
          {apps.map((a) => {
            const badge = statusBadge[a.status] ?? statusBadge.Pending;
            const stage = statuses[Math.min(a.statusIndex, statuses.length - 1)];
            return (
              <Link key={a.id} href={`/admin/applications/${a.id}`} className="mv-row" style={{ display: "grid", gridTemplateColumns: "1.1fr 1.8fr 1.4fr 1.4fr 0.9fr 32px", gap: 14, padding: "15px 22px", borderBottom: "1px solid #f1f5f9", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1F3C" }}>{a.ref}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1F3C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.fullName}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.email}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flagUrl(a.destinationFlag)} alt="" style={{ width: 20, height: 14, borderRadius: 3, objectFit: "cover", flex: "none" }} />
                  <span style={{ fontSize: 13.5, color: "#46566e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trCountry(a.destination)}</span>
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", padding: "5px 10px", borderRadius: 999 }}>{statusesTR[stage] ?? stage}</span>
                </div>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: badge.bg, color: badge.fg, fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot }} />{statusTR[a.status] ?? a.status}
                  </span>
                </div>
                <Icon name="chevronRight" size={17} stroke="#cbd5e1" width={2.4} />
              </Link>
            );
          })}
          {apps.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "#64748b", fontSize: 14.5 }}>Henüz başvuru yok.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
