import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/Icon";
import { statuses, statusBadge } from "@/lib/data";
import { trCountry, statusesTR, statusTR, docStateTR, planTR } from "@/lib/tr";
import { setPaymentStatus, setStage, setDocumentState, specialistReply } from "../../actions";

export const dynamic = "force-dynamic";

const DOC_STATES = ["Verified", "In review", "Action needed", "Missing"];
const PAYMENTS = ["Paid", "Pending", "Refunded"];

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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {statuses.map((s, i) => {
                const on = i === a.statusIndex;
                return (
                  <form key={s} action={setStage.bind(null, a.id, i)}>
                    <button type="submit" style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 9, border: on ? "none" : "1px solid #e2eaf2", background: on ? "#10b981" : "#fff", color: on ? "#fff" : "#46566e" }}>
                      {i + 1}. {statusesTR[s] ?? s}
                    </button>
                  </form>
                );
              })}
            </div>
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
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {DOC_STATES.map((st) => {
                        const on = d.state === st;
                        return (
                          <form key={st} action={setDocumentState.bind(null, a.id, d.id, st)}>
                            <button type="submit" style={{ cursor: "pointer", fontSize: 11.5, fontWeight: 700, padding: "5px 10px", borderRadius: 8, border: on ? "none" : "1px solid #e2eaf2", background: on ? "#0A1F3C" : "#fff", color: on ? "#fff" : "#64748b" }}>
                              {docStateTR[st] ?? st}
                            </button>
                          </form>
                        );
                      })}
                    </div>
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
            <form action={specialistReply.bind(null, a.id)} style={{ display: "grid", gap: 10 }}>
              <input name="who" placeholder="Uzman adı (örn. Amelia)" className="mv-input" style={inputStyle} />
              <textarea name="text" required placeholder="Müşteriye bir yanıt yazın…" className="mv-input" style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} />
              <button type="submit" className="mv-btn-emerald" style={{ justifySelf: "start", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, padding: "11px 20px", borderRadius: 11, cursor: "pointer" }}>
                Yanıt gönder
              </button>
            </form>
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
            <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 10 }}>{planTR[a.plan] ?? a.plan} · {a.paymentMethod ?? "—"}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PAYMENTS.map((st) => {
                const on = a.status === st;
                return (
                  <form key={st} action={setPaymentStatus.bind(null, a.id, st)}>
                    <button type="submit" style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "7px 12px", borderRadius: 9, border: on ? "none" : "1px solid #e2eaf2", background: on ? "#0A1F3C" : "#fff", color: on ? "#fff" : "#64748b" }}>
                      {statusTR[st] ?? st}
                    </button>
                  </form>
                );
              })}
            </div>
          </Card>

          <Card title="Başvuru bilgileri">
            <Grid>
              <Cell label="Referans" value={a.ref} />
              <Cell label="Vize türü" value={a.visaType} />
              <Cell label="Vize merkezi" value={a.visaCenter ?? "—"} />
              <Cell label="Resmi harç" value={a.govFee ?? "—"} />
              <Cell label="Seyahat tarihi" value={a.travelDate ?? "—"} />
              <Cell label="Kalış süresi" value={a.duration ?? "—"} />
              <Cell label="Telefon" value={a.phone ?? "—"} />
              <Cell label="Pasaport no." value={a.passport ?? "—"} />
              <Cell label="E-posta" value={a.email} />
              <Cell label="Uyruk" value={trCountry(a.nationality)} />
            </Grid>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

const inputStyle = { width: "100%", padding: "11px 14px", border: "1px solid #dbe3ec", borderRadius: 10, fontSize: 14, color: "#0c1a30", background: "#fff" } as const;

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
