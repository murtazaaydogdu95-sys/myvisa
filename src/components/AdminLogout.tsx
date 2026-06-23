"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

export function AdminLogout() {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  };
  return (
    <button
      onClick={logout}
      className="mv-side-link"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "11px 12px",
        borderRadius: 10,
        background: "none",
        border: "1px solid rgba(255,255,255,.12)",
        color: "#9fb2cc",
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <Icon name="x" size={16} width={2.2} /> Çıkış yap
    </button>
  );
}
