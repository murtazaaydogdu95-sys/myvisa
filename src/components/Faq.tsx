"use client";

import { useState } from "react";
import { faqs } from "@/lib/data";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ maxWidth: 820, margin: "0 auto", padding: "64px 24px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "#10b981",
          }}
        >
          SSS
        </span>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.025em", color: "#0A1F3C", margin: "12px 0 0" }}>
          Sıkça sorulan sorular
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              style={{
                background: "#fff",
                border: "1px solid #eef2f7",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(10,31,60,.04)",
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "20px 22px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#0A1F3C" }}>{f.q}</span>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    flex: "none",
                    borderRadius: 8,
                    background: "#f1f6fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10b981",
                    fontSize: 20,
                    fontWeight: 600,
                    transform: isOpen ? "rotate(45deg)" : "none",
                    transition: "transform .18s ease",
                  }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 22px 22px", fontSize: 14.5, color: "#64748b", lineHeight: 1.65 }}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
