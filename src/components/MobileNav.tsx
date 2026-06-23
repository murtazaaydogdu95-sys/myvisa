"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

const links = [
  { href: "/#how", label: "Nasıl çalışır" },
  { href: "/#services", label: "Hizmetler" },
  { href: "/#destinations", label: "Destinasyonlar" },
  { href: "/#pricing", label: "Fiyatlandırma" },
  { href: "/#faq", label: "SSS" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mv-hamburger" style={{ position: "relative" }}>
      <button
        type="button"
        aria-label="Menü"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #e8edf4", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Icon name={open ? "x" : "menu"} size={20} stroke="#0A1F3C" width={2.2} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div
            className="mv-pop"
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              zIndex: 50,
              width: 240,
              background: "#fff",
              border: "1px solid #e2eaf2",
              borderRadius: 14,
              boxShadow: "0 16px 40px rgba(10,31,60,.18)",
              padding: 8,
            }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "11px 12px", borderRadius: 9, fontSize: 14.5, fontWeight: 500, color: "#46566e", textDecoration: "none" }}>
                {l.label}
              </a>
            ))}
            <div style={{ height: 1, background: "#eef2f7", margin: "6px 4px" }} />
            <Link href="/login" onClick={() => setOpen(false)} style={{ display: "block", padding: "11px 12px", borderRadius: 9, fontSize: 14.5, fontWeight: 600, color: "#0A1F3C", textDecoration: "none" }}>
              Giriş yap
            </Link>
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="mv-btn-emerald"
              style={{ display: "block", textAlign: "center", margin: "6px 4px 4px", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 14.5, padding: "11px", borderRadius: 10, textDecoration: "none" }}
            >
              Başvuru Başlat
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
