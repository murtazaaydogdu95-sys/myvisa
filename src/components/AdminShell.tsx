import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import { AdminLogout } from "./AdminLogout";

type Key = "customers" | "applications" | "payments" | "messages";

const items: { key: Key; label: string; icon: IconName; href: string }[] = [
  { key: "customers", label: "Müşteriler", icon: "users", href: "/admin" },
  { key: "applications", label: "Başvurular", icon: "file", href: "/admin/applications" },
  { key: "payments", label: "Ödemeler", icon: "card", href: "/admin/payments" },
  { key: "messages", label: "Mesajlar", icon: "mail", href: "/admin/messages" },
];

export function AdminShell({
  active,
  title,
  subtitle,
  action,
  children,
}: {
  active: Key;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FA" }}>
      <div style={{ display: "flex", minHeight: "100vh" }} className="mv-admin">
        {/* sidebar */}
        <aside style={{ width: 228, flex: "none", background: "#071529", padding: "26px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "0 10px 18px", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#5d7393" }}>
            Yönetim
          </div>
          {items.map((it) => {
            const on = it.key === active;
            return (
              <Link
                key={it.key}
                href={it.href}
                className="mv-side-link"
                style={{
                  display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderRadius: 10,
                  background: on ? "rgba(16,185,129,.14)" : "transparent",
                  color: on ? "#fff" : "#9fb2cc", fontSize: 14, fontWeight: on ? 600 : 500, textDecoration: "none",
                }}
              >
                <Icon name={it.icon} size={18} stroke={on ? "#10b981" : "#7e93af"} width={2} />
                {it.label}
              </Link>
            );
          })}
          <div className="mv-side-back" style={{ marginTop: "auto", paddingTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/" className="mv-side-link" style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "11px 12px", borderRadius: 10, background: "none", border: "1px solid rgba(255,255,255,.12)", color: "#9fb2cc", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
              <Icon name="chevronLeft" size={16} width={2.2} /> Siteye dön
            </Link>
            <AdminLogout />
          </div>
        </aside>

        {/* content */}
        <div className="mv-admin-content" style={{ flex: 1, padding: "34px 38px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0A1F3C", letterSpacing: "-.02em", margin: 0 }}>{title}</h1>
              {subtitle && <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0" }}>{subtitle}</p>}
            </div>
            {action}
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
