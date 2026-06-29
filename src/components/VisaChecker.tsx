"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { originCountries, destinationOpts, visaCenters } from "@/lib/data";
import { runChecker, type CheckerResult } from "@/lib/checker";
import { trCountry, trTime } from "@/lib/tr";

const VISA_TYPES_TR = ["Hepsi", "Turist", "İş", "Öğrenci", "Çalışma", "Transit"];

type DD = "nat" | "dest" | "center" | "visa" | null;

const labelStyle = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  color: "#46566e",
  marginBottom: 6,
} as const;

const flagImg = {
  width: 22,
  height: 16,
  borderRadius: 3,
  objectFit: "cover",
  boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
  flex: "none",
} as const;

export function VisaChecker() {
  const [nationality, setNationality] = useState("Turkey"); // MyVisa serves Turkey-based applicants
  const [destination, setDestination] = useState("");
  const [visaCenter, setVisaCenter] = useState("");
  const [visaType, setVisaType] = useState("");
  const [openDD, setOpenDD] = useState<DD>(null);
  const [result, setResult] = useState<CheckerResult | null>(null);
  const [error, setError] = useState(false);

  const natSel = originCountries.find((c) => c.name === nationality) || null;
  const destSel = destinationOpts.find((c) => c.name === destination) || null;
  const centerOptions = nationality ? visaCenters[nationality] ?? [] : [];

  const onRun = () => {
    const r = runChecker({ nationality, destination, visaType, visaCenter });
    if (!r) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);
    setResult(r);
  };

  return (
    <div
      id="checker"
      className="mv-up mv-checker"
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 30,
        boxShadow: "0 30px 70px rgba(3,12,28,.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "#ecfdf5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="search" size={18} stroke="#10b981" width={2.2} />
        </span>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0A1F3C", margin: 0, letterSpacing: "-.01em" }}>
          Vize seçeneklerinizi kontrol edin
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 18px" }}>
        Anında uygunluk özeti için dört kısa soruyu yanıtlayın.
      </p>

      {openDD !== null && (
        <div onClick={() => setOpenDD(null)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
      )}

      {/* Applying from */}
      <label style={labelStyle}>Başvuru ülkesi</label>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <button
          type="button"
          className="mv-trigger"
          onClick={() => setOpenDD((d) => (d === "nat" ? null : "nat"))}
          style={triggerStyle}
        >
          {natSel ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={natSel.url} alt="" style={flagImg} />
              <span style={{ flex: 1, color: "#0c1a30" }}>{trCountry(natSel.name)}</span>
            </>
          ) : (
            <span style={{ flex: 1, color: "#94a3b8" }}>Ülkenizi seçin</span>
          )}
          <Icon name="chevronDown" size={12} stroke="#64748b" width={2.4} style={{ flex: "none" }} />
        </button>
        {openDD === "nat" && (
          <Dropdown
            items={originCountries}
            onPick={(name) => {
              setNationality(name);
              setVisaCenter(""); // centres differ per origin
              setOpenDD(null);
            }}
          />
        )}
      </div>

      {/* Destination */}
      <label style={labelStyle}>Gideceğiniz ülke</label>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <button
          type="button"
          className="mv-trigger"
          onClick={() => setOpenDD((d) => (d === "dest" ? null : "dest"))}
          style={triggerStyle}
        >
          {destSel ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={destSel.url} alt="" style={flagImg} />
              <span style={{ flex: 1, color: "#0c1a30" }}>{trCountry(destSel.name)}</span>
            </>
          ) : (
            <span style={{ flex: 1, color: "#94a3b8" }}>Nereye gidiyorsunuz?</span>
          )}
          <Icon name="chevronDown" size={12} stroke="#64748b" width={2.4} style={{ flex: "none" }} />
        </button>
        {openDD === "dest" && (
          <Dropdown
            items={destinationOpts}
            onPick={(name) => {
              setDestination(name);
              setOpenDD(null);
            }}
          />
        )}
      </div>

      {/* Visa center in + Visa type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div>
          <label style={labelStyle}>Vize merkezi</label>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="mv-trigger"
              disabled={!nationality}
              onClick={() => setOpenDD((d) => (d === "center" ? null : "center"))}
              style={{
                ...triggerStyle,
                cursor: nationality ? "pointer" : "not-allowed",
                background: nationality ? "#fff" : "#f8fafc",
              }}
            >
              <span style={{ flex: 1, color: visaCenter ? "#0c1a30" : "#94a3b8" }}>
                {visaCenter || (nationality ? "Bir şehir seçin" : "Önce başvuru ülkesini seçin")}
              </span>
              <Icon name="chevronDown" size={12} stroke="#64748b" width={2.4} style={{ flex: "none" }} />
            </button>
            {openDD === "center" && centerOptions.length > 0 && (
              <TextDropdown
                options={centerOptions}
                onPick={(v) => {
                  setVisaCenter(v);
                  setOpenDD(null);
                }}
              />
            )}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Vize türü</label>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="mv-trigger"
              onClick={() => setOpenDD((d) => (d === "visa" ? null : "visa"))}
              style={triggerStyle}
            >
              <span style={{ flex: 1, color: "#0c1a30" }}>{visaType || "Hepsi"}</span>
              <Icon name="chevronDown" size={12} stroke="#64748b" width={2.4} style={{ flex: "none" }} />
            </button>
            {openDD === "visa" && (
              <TextDropdown
                options={VISA_TYPES_TR}
                onPick={(v) => {
                  setVisaType(v === "Hepsi" ? "" : v);
                  setOpenDD(null);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onRun}
        className="mv-btn-navy"
        style={{
          width: "100%",
          background: "#0A1F3C",
          color: "#fff",
          border: "none",
          fontWeight: 700,
          fontSize: 15.5,
          padding: 15,
          borderRadius: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
        }}
      >
        Seçeneklerimi Göster
        <Icon name="arrowRight" size={17} stroke="#10b981" width={2.6} />
      </button>

      {error && (
        <div
          style={{
            marginTop: 14,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: 13.5,
            padding: "12px 14px",
            borderRadius: 10,
          }}
        >
          Seçeneklerinizi görmek için lütfen başvuru ülkenizi ve gideceğiniz ülkeyi seçin.
        </div>
      )}

      {result && (
        <div
          className="mv-pop"
          style={{
            marginTop: 16,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <Icon name="check" size={20} stroke="#059669" width={2.4} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#065f46" }}>
              Muhtemelen bir {visaType || "Turist"} vizesine ihtiyacınız olacak
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ResultCell label="İşlem süresi" value={trTime(result.time)} />
            <ResultCell label="Resmi harç" value={result.fee} />
            <ResultCell label="Gerekli belgeler" value={`${result.docs} belge`} />
            <ResultCell label="Destinasyon" value={trCountry(result.dest)} />
          </div>
          <Link
            href={`/apply?${new URLSearchParams({
              ...(destination ? { destination } : {}),
              ...(visaCenter ? { visaCenter } : {}),
              ...(visaType ? { visaType } : {}),
            }).toString()}`}
            className="mv-btn-emerald"
            style={{
              display: "block",
              textAlign: "center",
              width: "100%",
              marginTop: 14,
              background: "#10b981",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14.5,
              padding: 13,
              borderRadius: 11,
              textDecoration: "none",
            }}
          >
            Bu başvuruyu başlat →
          </Link>
        </div>
      )}
    </div>
  );
}

const triggerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "11px 14px",
  border: "1px solid #dbe3ec",
  borderRadius: 10,
  fontSize: 14.5,
  background: "#fff",
  cursor: "pointer",
  textAlign: "left",
} as const;

function ResultCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "11px 13px" }}>
      <div style={{ fontSize: 11.5, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0A1F3C", marginTop: 2 }}>{value}</div>
    </div>
  );
}

function TextDropdown({
  options,
  onPick,
}: {
  options: readonly string[];
  onPick: (value: string) => void;
}) {
  return (
    <div
      className="mv-pop"
      style={{
        position: "absolute",
        zIndex: 30,
        top: "calc(100% + 6px)",
        left: 0,
        right: 0,
        background: "#fff",
        border: "1px solid #e2eaf2",
        borderRadius: 12,
        boxShadow: "0 16px 40px rgba(10,31,60,.18)",
        padding: 6,
        maxHeight: 240,
        overflowY: "auto",
      }}
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="mv-opt"
          onClick={() => onPick(o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "9px 10px",
            background: "none",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            textAlign: "left",
            fontSize: 14,
            color: "#0c1a30",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Dropdown({
  items,
  onPick,
}: {
  items: { name: string; url: string }[];
  onPick: (name: string) => void;
}) {
  return (
    <div
      className="mv-pop"
      style={{
        position: "absolute",
        zIndex: 30,
        top: "calc(100% + 6px)",
        left: 0,
        right: 0,
        background: "#fff",
        border: "1px solid #e2eaf2",
        borderRadius: 12,
        boxShadow: "0 16px 40px rgba(10,31,60,.18)",
        padding: 6,
        maxHeight: 240,
        overflowY: "auto",
      }}
    >
      {items.map((c) => (
        <button
          key={c.name}
          type="button"
          className="mv-opt"
          onClick={() => onPick(c.name)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 10px",
            background: "none",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            textAlign: "left",
            fontSize: 14,
            color: "#0c1a30",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.url} alt="" style={flagImg} />
          <span>{trCountry(c.name)}</span>
        </button>
      ))}
    </div>
  );
}
