import Link from "next/link";
import { Icon } from "./Icon";

const linkStyle = { color: "#9fb2cc", textDecoration: "none" } as const;
const btnLinkStyle = {
  background: "none",
  border: "none",
  color: "#9fb2cc",
  fontSize: 13.5,
  textAlign: "left",
  padding: 0,
  cursor: "pointer",
  textDecoration: "none",
} as const;

export function Footer() {
  return (
    <footer style={{ background: "#071529", color: "#9fb2cc", padding: "56px 24px 32px" }}>
      <div
        className="mv-foot"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "linear-gradient(140deg,#0A1F3C,#10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="globe" size={18} stroke="#fff" width={2.2} />
            </span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
              My<span style={{ color: "#10b981" }}>Visa</span>
            </span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
            Vize yolculuğunuz artık çok kolay. Bağımsız vize danışmanlığı — resmi bir
            kurum değiliz ve vize düzenlemiyoruz.
          </p>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
            Ürün
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
            <Link href="/#services" className="mv-footlink" style={linkStyle}>Hizmetler</Link>
            <Link href="/#destinations" className="mv-footlink" style={linkStyle}>Destinasyonlar</Link>
            <Link href="/#pricing" className="mv-footlink" style={linkStyle}>Fiyatlandırma</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
            Şirket
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
            <Link href="/#faq" className="mv-footlink" style={linkStyle}>SSS</Link>
            <Link href="/contact" className="mv-footlink" style={btnLinkStyle}>İletişim</Link>
            <Link href="/dashboard" className="mv-footlink" style={btnLinkStyle}>Panelim</Link>
            <Link href="/terms" className="mv-footlink" style={linkStyle}>Kullanım Koşulları</Link>
            <Link href="/privacy" className="mv-footlink" style={linkStyle}>Gizlilik Politikası</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
            Hemen başlayın
          </div>
          <Link
            href="/apply"
            className="mv-btn-emerald"
            style={{
              display: "inline-block",
              background: "#10b981",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13.5,
              padding: "11px 18px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Başvuru Başlat
          </Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "36px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,.08)",
          fontSize: 12.5,
          color: "#5d7393",
        }}
      >
        © 2026 MyVisa.com — Tüm hakları saklıdır. Tasarım amacıyla oluşturulmuş kurgusal bir markadır.
      </div>
    </footer>
  );
}
