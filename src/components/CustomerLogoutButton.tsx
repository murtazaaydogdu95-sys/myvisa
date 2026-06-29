"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Logs the customer out (clears the mv_customer cookie) and returns home.
// Reused in the navbar (desktop + mobile menu).
export function CustomerLogoutButton({
  style,
  className,
  label = "Çıkış yap",
  onAction,
}: {
  style?: React.CSSProperties;
  className?: string;
  label?: string;
  onAction?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    if (busy) return;
    setBusy(true);
    onAction?.();
    await fetch("/api/customer/login", { method: "DELETE" }).catch(() => {});
    router.replace("/");
    router.refresh();
  };

  return (
    <button type="button" onClick={logout} disabled={busy} className={className} style={style}>
      {busy ? "Çıkış…" : label}
    </button>
  );
}
