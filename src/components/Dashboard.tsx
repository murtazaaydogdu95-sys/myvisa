"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { flagUrl, statuses } from "@/lib/data";
import { trCountry, statusesTR, docStateTR, statusTR, planTR } from "@/lib/tr";

export type DashApp = {
  id: string;
  ref: string;
  title: string;
  destination: string;
  destinationFlag: string;
  plan: string;
  amount: string;
  paidOn: string;
  status: string;
  statusIndex: number;
  documents: { id: string; name: string; state: string; size: number | null }[];
  messages: { who: string; when: string; text: string; fromCustomer: boolean }[];
};

const docColor: Record<string, { bg: string; fg: string }> = {
  Verified: { bg: "#ecfdf5", fg: "#047857" },
  "In review": { bg: "#eff6ff", fg: "#1d4ed8" },
  "Action needed": { bg: "#fffbeb", fg: "#b45309" },
  Missing: { bg: "#fef2f2", fg: "#b91c1c" },
};

export function Dashboard({ apps, email }: { apps: DashApp[]; email?: string }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(apps[0]?.id ?? "");
  const active = apps.find((a) => a.id === activeId) ?? apps[0];

  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    await fetch("/api/customer/login", { method: "DELETE" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  };

  const sendReply = async (applicationId: string) => {
    if (!reply.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/customer/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, text: reply }),
      });
      if (res.ok) {
        setReply("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const uploadDoc = async (applicationId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) return alert("Dosya çok büyük (en fazla 5 MB).");
    setBusy(true);
    try {
      const dataBase64 = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
        r.readAsDataURL(file);
      });
      const res = await fetch("/api/customer/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, name: file.name, mime: file.type, dataBase64 }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  if (!active) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0A1F3C" }}>Henüz başvuru yok</h1>
        <p style={{ fontSize: 15, color: "#64748b", margin: "10px 0 24px" }}>
          İlk vize başvurunuzu başlatın ve buradan takip edin.
        </p>
        <Link href="/apply" className="mv-btn-emerald" style={{ display: "inline-block", background: "#10b981", color: "#fff", fontWeight: 700, padding: "13px 22px", borderRadius: 12, textDecoration: "none" }}>
          Başvuru Başlat
        </Link>
      </div>
    );
  }

  return (
    <div className="mv-dash-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "34px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0A1F3C", letterSpacing: "-.02em", margin: 0 }}>
            Başvurularınız
          </h1>
          <p style={{ fontSize: 14.5, color: "#64748b", margin: "6px 0 0" }}>
            Vize uzmanlarınızdan gelen durum, belge ve mesajları takip edin.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {email && <span style={{ fontSize: 13.5, color: "#64748b" }}>{email}</span>}
          <button
            onClick={logout}
            className="mv-btn-ghost"
            style={{ background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 13.5, padding: "9px 16px", borderRadius: 10, cursor: "pointer" }}
          >
            Çıkış yap
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }} className="mv-dashgrid">
        {/* list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {apps.map((a) => {
            const isActive = a.id === active.id;
            return (
              <button
                key={a.id}
                onClick={() => setActiveId(a.id)}
                style={{
                  textAlign: "left", background: "#fff", cursor: "pointer",
                  border: isActive ? "2px solid #10b981" : "1px solid #eef2f7",
                  borderRadius: 16, padding: 18,
                  boxShadow: isActive ? "0 12px 30px rgba(16,185,129,.12)" : "0 1px 3px rgba(10,31,60,.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flagUrl(a.destinationFlag)} alt="" style={{ width: 24, height: 17, borderRadius: 3, objectFit: "cover", boxShadow: "0 0 0 1px rgba(0,0,0,.08)" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0A1F3C" }}>{a.title}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 12 }}>{a.ref} · {trCountry(a.destination)}</div>
                <StatusPill index={a.statusIndex} />
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* header card */}
          <div style={{ background: "linear-gradient(160deg,#071529,#0A1F3C)", borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, right: -50, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.18),transparent 70%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 13, position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flagUrl(active.destinationFlag)} alt="" style={{ width: 40, height: 28, borderRadius: 5, objectFit: "cover", boxShadow: "0 0 0 1px rgba(255,255,255,.2)" }} />
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-.02em" }}>{active.title}</h2>
                <div style={{ fontSize: 13.5, color: "#9fb2cc", marginTop: 4 }}>
                  {active.ref} · Gönderim: {active.paidOn || "—"} · {planTR[active.plan] ?? active.plan} plan
                </div>
              </div>
            </div>
          </div>

          {/* timeline */}
          <Card title="Durum zaman çizelgesi">
            <Timeline index={active.statusIndex} />
          </Card>

          {/* documents */}
          <Card title={`Belgeler (${active.documents.length})`}>
            {active.documents.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {active.documents.map((d) => {
                  const c = docColor[d.state] ?? { bg: "#f1f5f9", fg: "#64748b" };
                  return (
                    <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid #eef2f7", borderRadius: 12 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: "#f1f6fb", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                        <Icon name="file" size={17} stroke="#64748b" width={2} />
                      </span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#0A1F3C", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
                      {d.size ? (
                        <a href={`/api/documents/${d.id}`} target="_blank" style={{ fontSize: 12.5, fontWeight: 700, color: "#10b981", textDecoration: "none", flex: "none" }}>İndir</a>
                      ) : null}
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.fg, background: c.bg, padding: "5px 11px", borderRadius: 999, flex: "none" }}>{docStateTR[d.state] ?? d.state}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 13.5, padding: "10px 16px", borderRadius: 10, cursor: busy ? "wait" : "pointer" }}>
              <input type="file" accept="image/*,application/pdf" style={{ display: "none" }} disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDoc(active.id, f); e.target.value = ""; }} />
              <Icon name="upload" size={15} stroke="#10b981" width={2.2} /> Belge yükle
            </label>
          </Card>

          {/* messages */}
          <Card title="Mesajlar">
            {active.messages.length === 0 ? (
              <Empty text="Henüz mesaj yok." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {active.messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <span style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: isSystem(m.who) ? "#eef2f7" : "linear-gradient(140deg,#0A1F3C,#10b981)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                      {isSystem(m.who) ? <Icon name="shield" size={16} stroke="#64748b" width={2} /> : m.who[0]}
                    </span>
                    <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1F3C" }}>{m.who}</span>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.when}</span>
                      </div>
                      <p style={{ fontSize: 14, color: "#46566e", margin: 0, lineHeight: 1.55 }}>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendReply(active.id); }}
                placeholder="Uzmanınıza bir mesaj yazın…"
                className="mv-input"
                style={{ flex: 1, padding: "11px 14px", border: "1px solid #dbe3ec", borderRadius: 10, fontSize: 14, color: "#0c1a30", background: "#fff" }}
              />
              <button
                onClick={() => sendReply(active.id)}
                disabled={busy || !reply.trim()}
                className="mv-btn-emerald"
                style={{ background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, padding: "11px 18px", borderRadius: 10, cursor: busy || !reply.trim() ? "not-allowed" : "pointer", opacity: busy || !reply.trim() ? 0.7 : 1 }}
              >
                Gönder
              </button>
            </div>
          </Card>

          {/* payment */}
          <Card title="Ödeme">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: "16px 18px" }}>
              <div>
                <div style={{ fontSize: 12, color: "#047857", fontWeight: 600 }}>{planTR[active.plan] ?? active.plan} plan</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#065f46", marginTop: 2 }}>{active.amount}</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: "#047857", fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 999 }}>
                <Icon name="check" size={15} stroke="#10b981" width={2.6} /> {statusTR[active.status] ?? active.status}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const isSystem = (who: string) => who.startsWith("System") || who.startsWith("Sistem");

function StatusPill({ index }: { index: number }) {
  const label = statuses[Math.min(index, statuses.length - 1)];
  const done = index >= statuses.length - 1;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: done ? "#ecfdf5" : "#eff6ff", color: done ? "#047857" : "#1d4ed8", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: done ? "#10b981" : "#3b82f6" }} />
      {statusesTR[label] ?? label}
    </span>
  );
}

function Timeline({ index }: { index: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {statuses.map((s, i) => {
        const done = i < index;
        const current = i === index;
        const last = i === statuses.length - 1;
        return (
          <div key={s} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: done || current ? "#10b981" : "#fff", border: done || current ? "none" : "2px solid #e2eaf2" }}>
                {done ? <Icon name="check" size={13} stroke="#fff" width={3} /> : current ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} /> : null}
              </span>
              {!last && <span style={{ width: 2, flex: 1, minHeight: 26, background: done ? "#10b981" : "#e2eaf2" }} />}
            </div>
            <div style={{ paddingBottom: last ? 0 : 18 }}>
              <div style={{ fontSize: 14.5, fontWeight: current ? 700 : 600, color: done || current ? "#0A1F3C" : "#94a3b8" }}>{statusesTR[s] ?? s}</div>
              {current && <div style={{ fontSize: 12.5, color: "#10b981", marginTop: 2, fontWeight: 600 }}>Devam ediyor</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 24, boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 16px" }}>{title}</h3>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ fontSize: 14, color: "#94a3b8", padding: "8px 0" }}>{text}</div>;
}
