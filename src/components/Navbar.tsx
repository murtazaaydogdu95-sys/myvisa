import Link from "next/link";
import { Icon } from "./Icon";
import { MobileNav } from "./MobileNav";

const links = [
  { href: "/#how", label: "Nasıl çalışır" },
  { href: "/#services", label: "Hizmetler" },
  { href: "/#destinations", label: "Destinasyonlar" },
  { href: "/#pricing", label: "Fiyatlandırma" },
  { href: "/#faq", label: "SSS" },
];

export function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid #e8edf4",
      }}
    >
      <nav
        className="mv-nav"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(140deg,#0A1F3C,#10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16,185,129,.28)",
            }}
          >
            <Icon name="globe" size={20} stroke="#fff" width={2.2} />
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", color: "#0A1F3C" }}>
            My<span style={{ color: "#10b981" }}>Visa</span>
          </span>
        </Link>

        <div className="mv-navlinks" style={{ display: "flex", gap: 28, marginLeft: 18, flex: 1 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="mv-navlink"
              style={{ fontSize: 14.5, fontWeight: 500, color: "#46566e", textDecoration: "none" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
          <Link
            href="/login"
            className="mv-nav-login"
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: "#0A1F3C",
              textDecoration: "none",
              padding: "9px 6px",
            }}
          >
            Giriş yap
          </Link>
          <Link
            href="/apply"
            className="mv-btn-emerald mv-nav-cta"
            style={{
              background: "#10b981",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14.5,
              padding: "11px 20px",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 6px 16px rgba(16,185,129,.3)",
            }}
          >
            Başvuru Başlat
          </Link>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
