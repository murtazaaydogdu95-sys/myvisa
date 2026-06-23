"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0A1F3C", margin: 0 }}>Bir şeyler ters gitti</h1>
        <p style={{ fontSize: 15, color: "#64748b", margin: "10px 0 24px", lineHeight: 1.6 }}>
          Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={reset} className="mv-btn-emerald" style={{ background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 14.5, padding: "13px 22px", borderRadius: 12, cursor: "pointer" }}>
            Tekrar dene
          </button>
          <Link href="/" className="mv-btn-ghost" style={{ background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 14.5, padding: "13px 22px", borderRadius: 12, textDecoration: "none" }}>
            Ana sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
