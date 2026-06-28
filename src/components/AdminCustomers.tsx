"use client";

import { useState, useTransition } from "react";
import { Icon } from "./Icon";
import { flagUrl, statusBadge } from "@/lib/data";
import { trCountry, statusTR, planTR } from "@/lib/tr";
import { useToast } from "./Toast";
import { ConfirmDialog } from "./ConfirmDialog";

export type Customer = {
  id: string;
  name: string;
  email: string;
  initials: string;
  nationality: string;
  nationalityFlag: string;
  destination: string;
  destinationFlag: string;
  visa: string;
  plan: string;
  amount: string;
  govFee: string;
  status: string;
  paidOn: string;
  ref: string;
  txn: string;
  method: string;
  phone: string;
  passport: string;
  travelDate: string;
  duration: string;
};

export function AdminCustomers({
  customers,
  refund,
}: {
  customers: Customer[];
  refund: (id: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 7;
  const q = search.toLowerCase().trim();
  const list = customers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.ref.toLowerCase().includes(q) ||
      c.destination.toLowerCase().includes(q),
  );
  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageItems = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const onSearch = (v: string) => {
    setSearch(v);
    setPage(1); // jump back to first page on a new search
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ position: "relative", minWidth: 280 }}>
          <Icon name="search" size={17} stroke="#94a3b8" width={2.2} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Ad, e-posta, referans ara..."
            className="mv-input"
            style={{ width: "100%", padding: "11px 14px 11px 40px", border: "1px solid #dbe3ec", borderRadius: 10, fontSize: 14, color: "#0c1a30", background: "#fff" }}
          />
        </div>
      </div>

      {/* table */}
      <div className="mv-table-scroll" style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, boxShadow: "0 1px 3px rgba(10,31,60,.05)", overflowX: "auto" }}>
        <div className="mv-table-inner">
        <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1.6fr 1.1fr 1fr 0.9fr 32px", gap: 14, padding: "14px 22px", background: "#f8fafc", borderBottom: "1px solid #eef2f7", fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#94a3b8" }}>
          <div>Müşteri</div><div>Destinasyon</div><div>Plan</div><div>Tutar</div><div>Durum</div><div />
        </div>

        {pageItems.map((c) => {
          const badge = statusBadge[c.status] ?? statusBadge.Pending;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="mv-row"
              style={{ display: "grid", gridTemplateColumns: "2.4fr 1.6fr 1.1fr 1fr 0.9fr 32px", gap: 14, padding: "15px 22px", borderBottom: "1px solid #f1f5f9", alignItems: "center", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <span style={{ width: 38, height: 38, flex: "none", borderRadius: "50%", background: "linear-gradient(140deg,#0A1F3C,#10b981)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5, fontWeight: 700 }}>{c.initials}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0A1F3C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flagUrl(c.destinationFlag)} alt="" style={{ width: 22, height: 16, borderRadius: 3, objectFit: "cover", boxShadow: "0 0 0 1px rgba(0,0,0,.08)", flex: "none" }} />
                <span style={{ fontSize: 13.5, color: "#46566e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trCountry(c.destination)}</span>
              </div>
              <div style={{ fontSize: 13.5, color: "#46566e", fontWeight: 600 }}>{planTR[c.plan] ?? c.plan}</div>
              <div style={{ fontSize: 14, color: "#0A1F3C", fontWeight: 700 }}>{c.amount}</div>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: badge.bg, color: badge.fg, fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot }} />{statusTR[c.status] ?? c.status}
                </span>
              </div>
              <Icon name="chevronRight" size={17} stroke="#cbd5e1" width={2.4} />
            </div>
          );
        })}

        {list.length === 0 && (
          <div style={{ padding: 48, textAlign: "center", color: "#64748b", fontSize: 14.5 }}>
            &quot;{search}&quot; ile eşleşen müşteri yok.
          </div>
        )}
        </div>
      </div>

      {list.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {list.length} müşteriden {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, list.length)} arası gösteriliyor
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PageBtn disabled={current <= 1} onClick={() => setPage(current - 1)}>
              <Icon name="chevronLeft" size={15} width={2.4} /> Önceki
            </PageBtn>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  minWidth: 34, height: 34, borderRadius: 9, cursor: "pointer", fontSize: 13.5, fontWeight: 700,
                  border: n === current ? "none" : "1px solid #e2eaf2",
                  background: n === current ? "#0A1F3C" : "#fff",
                  color: n === current ? "#fff" : "#46566e",
                }}
              >
                {n}
              </button>
            ))}
            <PageBtn disabled={current >= pageCount} onClick={() => setPage(current + 1)}>
              Sonraki <Icon name="chevronRight" size={15} width={2.4} />
            </PageBtn>
          </div>
        </div>
      )}

      {selected && <CustomerDialog c={selected} onClose={() => setSelectedId(null)} refund={refund} />}
    </>
  );
}

function CustomerDialog({
  c,
  onClose,
  refund,
}: {
  c: Customer;
  onClose: () => void;
  refund: (id: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const badge = statusBadge[c.status] ?? statusBadge.Pending;
  const isPaid = c.status === "Paid";

  const doRefund = () =>
    startTransition(async () => {
      try {
        await refund(c.id);
        toast(`${c.name} için ödeme iade edildi.`, "success");
        setConfirmOpen(false);
        onClose();
      } catch {
        toast("İade işlemi başarısız oldu. Lütfen tekrar deneyin.", "error");
      }
    });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(7,21,41,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} className="mv-pop" style={{ width: 560, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 20, boxShadow: "0 30px 80px rgba(3,12,28,.4)" }}>
        {/* header */}
        <div style={{ background: "linear-gradient(160deg,#071529,#0A1F3C)", padding: "26px 28px", borderRadius: "20px 20px 0 0", position: "relative" }}>
          <button onClick={onClose} aria-label="Kapat" style={{ position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={16} stroke="#fff" width={2.4} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <span style={{ width: 54, height: 54, flex: "none", borderRadius: "50%", background: "linear-gradient(140deg,#10b981,#059669)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700 }}>{c.initials}</span>
            <div>
              <h2 style={{ fontSize: 21, fontWeight: 800, color: "#fff", letterSpacing: "-.02em", margin: 0 }}>{c.name}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flagUrl(c.nationalityFlag)} alt="" style={{ width: 19, height: 14, borderRadius: 2, objectFit: "cover", boxShadow: "0 0 0 1px rgba(255,255,255,.2)" }} />
                <span style={{ fontSize: 13.5, color: "#9fb2cc" }}>{trCountry(c.nationality)}</span>
                <span style={{ color: "#3d5573" }}>·</span>
                <span style={{ fontSize: 13.5, color: "#9fb2cc" }}>{c.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: "26px 28px" }}>
          {/* payment summary */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: isPaid ? "#ecfdf5" : "#fef2f2", border: `1px solid ${isPaid ? "#a7f3d0" : "#fecaca"}`, borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: isPaid ? "#047857" : "#b91c1c", fontWeight: 600 }}>
                {isPaid ? "Ödeme alındı" : `Ödeme: ${statusTR[c.status] ?? c.status}`}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: isPaid ? "#065f46" : "#991b1b", letterSpacing: "-.02em", marginTop: 2 }}>{c.amount}</div>
              <div style={{ fontSize: 12, color: isPaid ? "#059669" : "#b91c1c", marginTop: 2 }}>{planTR[c.plan] ?? c.plan} plan · {c.method}</div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: badge.fg, fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: badge.dot }} />{statusTR[c.status] ?? c.status}
            </span>
          </div>

          <SectionLabel>Başvuru ayrıntıları</SectionLabel>
          <Grid>
            <Cell label="Referans" value={c.ref} />
            <Cell label="Vize türü" value={c.visa} />
            <Cell label="Destinasyon" value={trCountry(c.destination)} />
            <Cell label="Resmi harç" value={c.govFee} />
            <Cell label="Seyahat tarihi" value={c.travelDate} />
            <Cell label="Kalış süresi" value={c.duration} />
          </Grid>

          <div style={{ height: 24 }} />
          <SectionLabel>Müşteri ve işlem</SectionLabel>
          <Grid>
            <Cell label="Telefon" value={c.phone} />
            <Cell label="Pasaport no." value={c.passport} />
            <Cell label="İşlem kimliği" value={c.txn} />
            <Cell label="Ödeme tarihi" value={c.paidOn} />
          </Grid>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button onClick={onClose} className="mv-btn-navy" style={{ flex: 1, background: "#0A1F3C", color: "#fff", border: "none", fontWeight: 700, fontSize: 14.5, padding: 13, borderRadius: 11, cursor: "pointer" }}>
              Kapat
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={pending || !isPaid}
              className="mv-btn-ghost"
              style={{ flex: "none", background: "#f1f6fb", color: isPaid ? "#0A1F3C" : "#94a3b8", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 14.5, padding: "13px 20px", borderRadius: 11, cursor: pending || !isPaid ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon name="refund" size={16} width={2.2} />
              {pending ? "İade ediliyor…" : isPaid ? "İade et" : "İade edildi"}
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          title="Ödemeyi iade et"
          message={`${c.name} adlı müşteriye ait ${c.amount} tutarındaki ödemeyi iade etmek istediğinize emin misiniz? Bu işlem durumu "İade edildi" olarak değiştirir.`}
          confirmLabel="Evet, iade et"
          cancelLabel="Vazgeç"
          danger
          pending={pending}
          onConfirm={doRefund}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}

function PageBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, height: 34, padding: "0 12px", borderRadius: 9,
        border: "1px solid #e2eaf2", background: "#fff", fontSize: 13.5, fontWeight: 600,
        color: disabled ? "#cbd5e1" : "#0A1F3C", cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 14 }}>{children}</div>;
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>{children}</div>;
}
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: "#0A1F3C" }}>{value}</div>
    </div>
  );
}
