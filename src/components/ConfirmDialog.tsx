"use client";

import { Icon } from "./Icon";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  danger = false,
  pending = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const accent = danger ? "#dc2626" : "#10b981";
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(7,21,41,.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mv-pop"
        role="alertdialog"
        aria-modal="true"
        style={{ width: 420, maxWidth: "100%", background: "#fff", borderRadius: 18, boxShadow: "0 30px 80px rgba(3,12,28,.4)", padding: "28px 28px 24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 12 }}>
          <span
            style={{
              flex: "none",
              width: 42,
              height: 42,
              borderRadius: 12,
              background: danger ? "#fef2f2" : "#ecfdf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={danger ? "xCircle" : "check"} size={20} stroke={accent} width={2.4} />
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0A1F3C", letterSpacing: "-.01em", margin: 0 }}>{title}</h2>
        </div>
        <p style={{ fontSize: 14.5, color: "#46566e", lineHeight: 1.6, margin: "0 0 22px" }}>{message}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={pending}
            className="mv-btn-ghost"
            style={{ flex: 1, background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 14.5, padding: 12, borderRadius: 11, cursor: pending ? "not-allowed" : "pointer" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            style={{ flex: 1, background: accent, color: "#fff", border: "none", fontWeight: 700, fontSize: 14.5, padding: 12, borderRadius: 11, cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "İşleniyor…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
