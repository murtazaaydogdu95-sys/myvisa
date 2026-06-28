"use client";

import { useState, useTransition } from "react";
import { statuses } from "@/lib/data";
import { statusesTR, statusTR, docStateTR } from "@/lib/tr";
import { useToast } from "./Toast";
import { ConfirmDialog } from "./ConfirmDialog";

const DOC_STATES = ["Verified", "In review", "Action needed", "Missing"];
const PAYMENTS = ["Paid", "Pending", "Refunded"];

const inputStyle = { width: "100%", padding: "11px 14px", border: "1px solid #dbe3ec", borderRadius: 10, fontSize: 14, color: "#0c1a30", background: "#fff" } as const;

export function StageControl({
  id,
  current,
  action,
}: {
  id: string;
  current: number;
  action: (id: string, statusIndex: number) => Promise<void>;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();

  const select = (i: number, label: string) => {
    if (i === current) return;
    start(async () => {
      try {
        await action(id, i);
        toast(`Süreç aşaması "${label}" olarak güncellendi.`, "success");
      } catch {
        toast("Aşama güncellenemedi. Lütfen tekrar deneyin.", "error");
      }
    });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {statuses.map((s, i) => {
        const on = i === current;
        const label = statusesTR[s] ?? s;
        return (
          <button
            key={s}
            disabled={pending}
            onClick={() => select(i, label)}
            style={{ cursor: on ? "default" : "pointer", fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 9, border: on ? "none" : "1px solid #e2eaf2", background: on ? "#10b981" : "#fff", color: on ? "#fff" : "#46566e", opacity: pending && !on ? 0.6 : 1 }}
          >
            {i + 1}. {label}
          </button>
        );
      })}
    </div>
  );
}

export function DocStateControl({
  id,
  documentId,
  current,
  action,
}: {
  id: string;
  documentId: string;
  current: string;
  action: (id: string, documentId: string, state: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();

  const select = (st: string, label: string) => {
    if (st === current) return;
    start(async () => {
      try {
        await action(id, documentId, st);
        toast(`Belge durumu "${label}" olarak güncellendi.`, "success");
      } catch {
        toast("Belge durumu güncellenemedi.", "error");
      }
    });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {DOC_STATES.map((st) => {
        const on = st === current;
        const label = docStateTR[st] ?? st;
        return (
          <button
            key={st}
            disabled={pending}
            onClick={() => select(st, label)}
            style={{ cursor: on ? "default" : "pointer", fontSize: 11.5, fontWeight: 700, padding: "5px 10px", borderRadius: 8, border: on ? "none" : "1px solid #e2eaf2", background: on ? "#0A1F3C" : "#fff", color: on ? "#fff" : "#64748b", opacity: pending && !on ? 0.6 : 1 }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function PaymentControl({
  id,
  current,
  action,
}: {
  id: string;
  current: string;
  action: (id: string, status: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();
  const [target, setTarget] = useState<string | null>(null);

  const confirm = () => {
    if (!target) return;
    const label = statusTR[target] ?? target;
    start(async () => {
      try {
        await action(id, target);
        toast(`Ödeme durumu "${label}" olarak güncellendi.`, "success");
        setTarget(null);
      } catch {
        toast("Ödeme durumu güncellenemedi.", "error");
      }
    });
  };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {PAYMENTS.map((st) => {
          const on = current === st;
          return (
            <button
              key={st}
              disabled={pending}
              onClick={() => !on && setTarget(st)}
              style={{ cursor: on ? "default" : "pointer", fontSize: 12, fontWeight: 700, padding: "7px 12px", borderRadius: 9, border: on ? "none" : "1px solid #e2eaf2", background: on ? "#0A1F3C" : "#fff", color: on ? "#fff" : "#64748b" }}
            >
              {statusTR[st] ?? st}
            </button>
          );
        })}
      </div>

      {target && (
        <ConfirmDialog
          title="Ödeme durumunu değiştir"
          message={`Ödeme durumunu "${statusTR[target] ?? target}" olarak değiştirmek istediğinize emin misiniz?`}
          confirmLabel="Evet, değiştir"
          cancelLabel="Vazgeç"
          danger={target === "Refunded"}
          pending={pending}
          onConfirm={confirm}
          onCancel={() => setTarget(null)}
        />
      )}
    </>
  );
}

export function ReplyForm({
  id,
  action,
}: {
  id: string;
  action: (id: string, formData: FormData) => Promise<void>;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();
  const [who, setWho] = useState("");
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast("Lütfen bir yanıt yazın.", "error");
      return;
    }
    const fd = new FormData();
    fd.set("who", who);
    fd.set("text", text);
    start(async () => {
      try {
        await action(id, fd);
        setText("");
        setWho("");
        toast("Yanıt müşteriye gönderildi ✓", "success");
      } catch {
        toast("Yanıt gönderilemedi. Lütfen tekrar deneyin.", "error");
      }
    });
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
      <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Uzman adı (örn. Amelia)" className="mv-input" style={inputStyle} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Müşteriye bir yanıt yazın…" className="mv-input" style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} />
      <button type="submit" disabled={pending} className="mv-btn-emerald" style={{ justifySelf: "start", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, padding: "11px 20px", borderRadius: 11, cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.7 : 1 }}>
        {pending ? "Gönderiliyor…" : "Yanıt gönder"}
      </button>
    </form>
  );
}
