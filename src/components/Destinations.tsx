"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { destinations, destinationOpts } from "@/lib/data";
import { trCountry, trTag, trTime } from "@/lib/tr";

const codeByName: Record<string, string> = Object.fromEntries(
  destinationOpts.map((c) => [c.name, c.code]),
);

export function Destinations() {
  const [q, setQ] = useState("");
  const query = q.toLowerCase().trim();
  const filtered = destinations.filter(
    (d) =>
      !query ||
      d.name.toLowerCase().indexOf(query) > -1 ||
      d.tag.toLowerCase().indexOf(query) > -1,
  );

  return (
    <section id="destinations" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 36,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <span style={eyebrow}>Destinasyon rehberleri</span>
          <h2 style={h2}>Nereye gidiyorsunuz?</h2>
          <p style={{ fontSize: 17, color: "#64748b", margin: "12px 0 0", lineHeight: 1.6 }}>
            Türkiye&apos;den başvurabileceğiniz destinasyonlar için gereklilikler, işlem süreleri ve ücretler.
          </p>
        </div>
        <div style={{ position: "relative", minWidth: 280 }}>
          <Icon
            name="search"
            size={18}
            stroke="#94a3b8"
            width={2.2}
            style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ülke ara..."
            className="mv-input"
            style={{
              width: "100%",
              padding: "14px 16px 14px 42px",
              border: "1px solid #dbe3ec",
              borderRadius: 12,
              fontSize: 15,
              color: "#0c1a30",
              background: "#fff",
            }}
          />
        </div>
      </div>

      <div className="mv-dest" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {filtered.map((d) => (
          <div
            key={d.name}
            className="mv-card"
            style={{
              background: "#fff",
              border: "1px solid #eef2f7",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(10,31,60,.05)",
            }}
          >
            <div
              style={{
                height: 120,
                backgroundImage: `linear-gradient(140deg, ${d.from}, ${d.to})`,
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                padding: 16,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.5,
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, rgba(255,255,255,.18), transparent 50%)",
                }}
              />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  position: "relative",
                }}
              >
                {codeByName[d.name] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://flagcdn.com/w80/${codeByName[d.name]}.png`}
                    alt={`${trCountry(d.name)} bayrağı`}
                    width={30}
                    height={20}
                    style={{
                      width: 30,
                      height: 20,
                      objectFit: "cover",
                      borderRadius: 4,
                      boxShadow: "0 1px 6px rgba(0,0,0,.35)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-.01em",
                    textShadow: "0 1px 8px rgba(0,0,0,.3)",
                  }}
                >
                  {trCountry(d.name)}
                </span>
              </span>
            </div>
            <div style={{ padding: 18 }}>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px" }}>{trTag(d.tag)}</p>
              <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>İşlem süresi</div>
                  <div style={metric}>{trTime(d.time)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Belgeler</div>
                  <div style={metric}>{d.docs} belge</div>
                </div>
              </div>
              <Link
                href="/apply"
                className="mv-dest-btn"
                style={{
                  display: "block",
                  textAlign: "center",
                  width: "100%",
                  background: "#f1f6fb",
                  color: "#0A1F3C",
                  border: "1px solid #e2eaf2",
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: 11,
                  borderRadius: 10,
                  textDecoration: "none",
                }}
              >
                Başvuru başlat
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#64748b", fontSize: 15 }}>
          &quot;{q}&quot; ile eşleşen destinasyon yok. Başka bir ülke deneyin.
        </div>
      )}

      <p style={{ fontSize: 13, color: "#94a3b8", margin: "28px 0 0", lineHeight: 1.6 }}>
        İşlem süresi, Türkiye&apos;den her rota için güncel randevu bekleme tahminini gösterir; gerçek vize
        kararı, vize türüne ve konsolosluk yoğunluğuna bağlı olarak ~2–6 hafta daha sürer.
      </p>
    </section>
  );
}

const eyebrow = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#10b981",
} as const;
const h2 = {
  fontSize: 40,
  fontWeight: 800,
  letterSpacing: "-.025em",
  color: "#0A1F3C",
  margin: "12px 0 0",
} as const;
const metric = { fontSize: 13.5, fontWeight: 700, color: "#0A1F3C", marginTop: 2 } as const;
