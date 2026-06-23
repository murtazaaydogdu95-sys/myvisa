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

export function CustomerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
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
        setError(data?.error ?? "Giriş yapılamadı. Lütfen tekrar deneyin.");
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

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
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

      <button
        type="submit"
        disabled={loading}
        className="mv-btn-emerald"
        style={{
          background: "#10b981",
          color: "#fff",
          border: "none",
          fontWeight: 700,
          fontSize: 15,
          padding: 14,
          borderRadius: 12,
          cursor: loading ? "wait" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          opacity: loading ? 0.75 : 1,
          boxShadow: "0 8px 20px rgba(16,185,129,.3)",
          marginTop: 4,
        }}
      >
        {loading ? "Giriş yapılıyor…" : "Giriş yap"}
        {!loading && <Icon name="arrowRight" size={17} stroke="#fff" width={2.4} />}
      </button>
    </form>
  );
}
