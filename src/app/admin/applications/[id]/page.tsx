import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/Icon";
import { statusBadge } from "@/lib/data";
import { trCountry, statusTR, planTR } from "@/lib/tr";
import { setPaymentStatus, setStage, setDocumentState, specialistReply } from "../../actions";
import { StageControl, DocStateControl, PaymentControl, ReplyForm } from "@/components/AdminAppControls";

export const dynamic = "force-dynamic";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await prisma.application.findUnique({
    where: { id },
    include: { documents: { orderBy: { createdAt: "asc" } }, messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!a) notFound();

  const badge = statusBadge[a.status] ?? statusBadge.Pending;

  return (
    <AdminShell active="applications" title={a.fullName} subtitle={`${a.ref} · ${trCountry(a.destination)}`} action={
      <Link href="/admin/applications" className="mv-btn-ghost" style={{ background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 13.5, padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>
        ← Başvurular
      </Link>
    }>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }} className="mv-dashgrid">
        {/* left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* stage control */}
          <Card title="Süreç aşaması">
            <StageControl id={a.id} current={a.statusIndex} action={setStage} />
          </Card>

          {/* documents */}
          <Card title={`Belgeler (${a.documents.length})`}>
            {a.documents.length === 0 ? (
              <div style={{ fontSize: 14, color: "#94a3b8" }}>Belge yok.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {a.documents.map((d) => (
                  <div key={d.id} style={{ border: "1px solid #eef2f7", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <Icon name="file" size={17} stroke="#64748b" width={2} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#0A1F3C" }}>{d.name}</span>
                      {d.size ? (
                        <a href={`/api/documents/${d.id}`} target="_blank" style={{ fontSize: 12.5, fontWeight: 700, color: "#10b981", textDecoration: "none" }}>İndir</a>
                      ) : (
                        <span style={{ fontSize: 12, color: "#cbd5e1" }}>dosya yok</span>
                      )}
                    </div>
                    <DocStateControl id={a.id} documentId={d.id} current={d.state} action={setDocumentState} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* messages + reply */}
          <Card title="Mesajlar">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              {a.messages.map((m) => (
                <div key={m.id} style={{ background: m.fromCustomer ? "#ecfdf5" : "#f8fafc", border: `1px solid ${m.fromCustomer ? "#a7f3d0" : "#eef2f7"}`, borderRadius: 12, padding: "11px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1F3C" }}>{m.who}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.when}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#46566e", margin: 0, lineHeight: 1.55 }}>{m.text}</p>
                </div>
              ))}
              {a.messages.length === 0 && <div style={{ fontSize: 14, color: "#94a3b8" }}>Henüz mesaj yok.</div>}
            </div>
            <ReplyForm id={a.id} action={specialistReply} />
          </Card>
        </div>

        {/* right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card title="Ödeme">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#0A1F3C" }}>{a.amount}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: badge.bg, color: badge.fg, fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot }} />{statusTR[a.status] ?? a.status}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 10 }}>
              {planTR[a.plan] ?? a.plan} · {a.paymentMethod ?? "—"}
              {a.perPerson ? ` · ${a.persons} kişi × ${a.perPerson}` : ""}
            </div>
            <PaymentControl id={a.id} current={a.status} action={setPaymentStatus} />
          </Card>

          <Card title="Başvuru bilgileri">
            <Grid>
              <Cell label="Referans" value={a.ref} />
              <Cell label="Vize türü" value={a.visaType} />
              <Cell label="Vize merkezi" value={a.visaCenter ?? "—"} />
              <Cell label="Resmi harç" value={a.govFee ?? "—"} />
              <Cell label="Seyahat tarihi" value={a.travelDate ?? "—"} />
              <Cell label="Kalış süresi" value={a.duration ?? "—"} />
              <Cell label="Amaç" value={a.purpose ?? "—"} />
              <Cell label="Karşılayan" value={a.sponsor ?? "—"} />
              <Cell label="Konaklama" value={a.accommodation ?? "—"} />
              <Cell label="Çocuk seyahati" value={a.hasChildren ? "Evet" : "Hayır"} />
              <Cell label="Telefon" value={a.phone ?? "—"} />
              <Cell label="E-posta" value={a.email} />
              <Cell label="Cinsiyet" value={a.gender ?? "—"} />
              <Cell label="Uyruk" value={trCountry(a.nationality)} />
              <Cell label="Pasaport no." value={a.passport ?? "—"} />
              <Cell label="Pasaport geçerlilik" value={a.passportExpiry ?? "—"} />
              <Cell label="Çalışma durumu" value={a.employment ?? "—"} />
              <Cell label="Adres" value={[a.addressLine1, a.addressLine2, a.city, a.state].filter(Boolean).join(", ") || "—"} />
            </Grid>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 16px" }}>{title}</h3>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>{children}</div>;
}
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1F3C", wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}
