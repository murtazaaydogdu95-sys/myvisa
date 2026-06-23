import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CustomerLoginForm } from "@/components/CustomerLoginForm";

export const metadata = { title: "Giriş yap — MyVisa" };

export default function CustomerLoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg,#071529 0%,#0A1F3C 52%,#0c2a4d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -120, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.20),transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -160, left: -120, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,rgba(33,96,170,.26),transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: 420, maxWidth: "100%", position: "relative" }}>
        {/* brand */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 22 }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "linear-gradient(140deg,#0A1F3C,#10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16,185,129,.28)",
            }}
          >
            <Icon name="globe" size={22} stroke="#fff" width={2.2} />
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", color: "#fff" }}>
            My<span style={{ color: "#10b981" }}>Visa</span>
          </span>
        </Link>

        {/* card */}
        <div className="mv-pop" style={{ background: "#fff", borderRadius: 24, padding: "34px 32px", boxShadow: "0 30px 70px rgba(3,12,28,.45)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0A1F3C", margin: 0, letterSpacing: "-.01em" }}>
            Hesabınıza giriş yapın
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "8px 0 22px" }}>
            Başvurularınızı takip etmek için başvuruda kullandığınız e-postayı girin.
          </p>

          <CustomerLoginForm />

          <p style={{ fontSize: 13, color: "#64748b", margin: "20px 0 0", textAlign: "center" }}>
            Henüz başvurunuz yok mu?{" "}
            <Link href="/apply" style={{ color: "#10b981", fontWeight: 700, textDecoration: "none" }}>
              Başvuru başlatın
            </Link>
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/" className="mv-footlink" style={{ fontSize: 13.5, color: "#9fb2cc", textDecoration: "none" }}>
            ← Siteye dön
          </Link>
        </div>
      </div>
    </main>
  );
}
