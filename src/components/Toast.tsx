"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Icon } from "./Icon";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

type ToastApi = { toast: (message: string, type?: ToastType) => void };

const ToastContext = createContext<ToastApi | null>(null);

const STYLES: Record<ToastType, { bg: string; border: string; fg: string; icon: "check" | "xCircle" | "globe" }> = {
  success: { bg: "#ecfdf5", border: "#a7f3d0", fg: "#047857", icon: "check" },
  error: { bg: "#fef2f2", border: "#fecaca", fg: "#b91c1c", icon: "xCircle" },
  info: { bg: "#eff6ff", border: "#bfdbfe", fg: "#1d4ed8", icon: "globe" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((x) => x.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++counter.current;
      setItems((x) => [...x, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          top: 18,
          right: 18,
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
          maxWidth: "calc(100vw - 36px)",
        }}
      >
        {items.map((t) => {
          const s = STYLES[t.type];
          return (
            <div
              key={t.id}
              role="status"
              onClick={() => remove(t.id)}
              className="mv-toast"
              style={{
                pointerEvents: "auto",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 11,
                minWidth: 260,
                maxWidth: 380,
                background: "#fff",
                border: `1px solid ${s.border}`,
                borderLeft: `4px solid ${s.fg}`,
                borderRadius: 12,
                padding: "13px 16px",
                boxShadow: "0 14px 40px rgba(10,31,60,.16)",
              }}
            >
              <span
                style={{
                  flex: "none",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={s.icon} size={15} stroke={s.fg} width={2.6} />
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0c1a30", lineHeight: 1.4 }}>
                {t.message}
              </span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  return ctx ?? { toast: () => {} };
}
