"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #dbe3ec",
  borderRadius: 10,
  fontSize: 14.5,
  color: "#0c1a30",
  background: "#fff",
} as const;
const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#46566e", marginBottom: 6 } as const;
const btnStyle = {
  background: "#10b981",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  padding: 14,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  boxShadow: "0 8px 20px rgba(16,185,129,.3)",
  marginTop: 4,
} as const;

export function CustomerLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }
      setStep("code"); // generic success — a code is sent only if an account exists
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/customer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Kod doğrulanamadı. Lütfen tekrar deneyin.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "code") {
    return (
      <form onSubmit={verifyCode} style={{ display: "grid", gap: 16 }}>
        <p style={{ fontSize: 14, color: "#46566e", margin: 0, lineHeight: 1.6 }}>
          <strong>{email}</strong> adresine bir giriş kodu gönderdik (kayıtlı bir başvuru varsa).
          Kodu aşağıya girin.
        </p>
        <div>
          <label style={labelStyle}>6 haneli kod</label>
          <input
            className="mv-input"
            inputMode="numeric"
            maxLength={6}
            style={{ ...inputStyle, letterSpacing: 6, fontSize: 20, textAlign: "center", fontWeight: 700 }}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5, padding: "12px 14px", borderRadius: 10 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || code.length !== 6} className="mv-btn-emerald" style={{ ...btnStyle, cursor: loading ? "wait" : "pointer", opacity: loading || code.length !== 6 ? 0.7 : 1 }}>
          {loading ? "Doğrulanıyor…" : "Giriş yap"}
          {!loading && <Icon name="arrowRight" size={17} stroke="#fff" width={2.4} />}
        </button>
        <button
          type="button"
          onClick={() => { setStep("email"); setCode(""); setError(""); }}
          style={{ background: "none", border: "none", color: "#64748b", fontSize: 13.5, fontWeight: 600, cursor: "pointer", padding: 4 }}
        >
          ← E-posta adresini değiştir
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={requestCode} style={{ display: "grid", gap: 16 }}>
      <div>
        <label style={labelStyle}>E-posta adresi</label>
        <input
          className="mv-input"
          type="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="siz@eposta.com"
          autoComplete="email"
          autoFocus
        />
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5, padding: "12px 14px", borderRadius: 10 }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="mv-btn-emerald" style={{ ...btnStyle, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.75 : 1 }}>
        {loading ? "Gönderiliyor…" : "Giriş kodu gönder"}
        {!loading && <Icon name="arrowRight" size={17} stroke="#fff" width={2.4} />}
      </button>
    </form>
  );
}
