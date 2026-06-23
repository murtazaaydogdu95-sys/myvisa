"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F5F7FA" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 460 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0A1F3C", margin: 0 }}>Bir şeyler ters gitti</h1>
            <p style={{ fontSize: 15, color: "#64748b", margin: "10px 0 24px" }}>
              Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
            </p>
            <button onClick={reset} style={{ background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 14.5, padding: "13px 22px", borderRadius: 12, cursor: "pointer" }}>
              Tekrar dene
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
