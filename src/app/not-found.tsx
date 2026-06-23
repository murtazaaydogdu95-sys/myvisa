import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 67px)", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 460 }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#0A1F3C", letterSpacing: "-.03em" }}>404</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0A1F3C", margin: "8px 0 0" }}>Sayfa bulunamadı</h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: "10px 0 24px", lineHeight: 1.6 }}>
            Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
          </p>
          <Link href="/" className="mv-btn-emerald" style={{ display: "inline-block", background: "#10b981", color: "#fff", fontWeight: 700, padding: "13px 24px", borderRadius: 12, textDecoration: "none" }}>
            Ana sayfaya dön
          </Link>
        </div>
      </main>
    </>
  );
}
