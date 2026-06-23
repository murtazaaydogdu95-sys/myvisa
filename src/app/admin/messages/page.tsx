import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Mesajlar — Yönetim" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell active="messages" title="İletişim mesajları" subtitle="İletişim formundan gelen tüm mesajlar.">
      {messages.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: 48, textAlign: "center", color: "#64748b", fontSize: 14.5 }}>
          Henüz mesaj yok.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: "linear-gradient(140deg,#0A1F3C,#10b981)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0A1F3C" }}>{m.name}</div>
                    <a href={`mailto:${m.email}`} style={{ fontSize: 12.5, color: "#10b981", textDecoration: "none" }}>{m.email}</a>
                  </div>
                </div>
                <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                  {m.createdAt.toLocaleString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#46566e", margin: "14px 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.message}</p>
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("MyVisa — mesajınız hakkında")}`}
                className="mv-btn-ghost"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 14, background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 13, padding: "8px 14px", borderRadius: 10, textDecoration: "none" }}
              >
                <Icon name="mail" size={15} width={2} /> Yanıtla
              </a>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
