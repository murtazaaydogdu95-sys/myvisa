"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./Icon";
import { countries, destinationOpts, purposes, SERVICE_PLAN_NAME, priceForPersons, genders, employmentStatuses, sponsors, accommodations, visaCenters } from "@/lib/data";
import { trCountry, purposeTR } from "@/lib/tr";
import { useToast } from "./Toast";

type Wizard = {
  fullName: string; email: string; phone: string; dob: string; gender: string;
  nationality: string; passport: string; passportExpiry: string; employment: string;
  addressLine1: string; addressLine2: string; city: string; state: string;
  destination: string; visaCenter: string; purpose: string; sponsor: string;
  accommodation: string; hasChildren: string; persons: string; travelDate: string; duration: string;
  cardName: string; cardNumber: string; expiry: string; cvv: string;
};

type Upload = { name: string; size: string; mime?: string; dataBase64?: string };

const humanSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
type Errors = Partial<Record<string, string>>;

const STEP_LABELS = ["Kişisel", "Seyahat", "Belgeler", "İnceleme", "Ödeme"];
const SUGGESTED = ["Pasaport.pdf", "Fotoğraf.jpg", "Banka ekstresi.pdf", "Seyahat planı.pdf", "Konaklama.pdf"];

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #dbe3ec",
  borderRadius: 10,
  fontSize: 14.5,
  color: "#0c1a30",
  background: "#fff",
} as const;

const selectStyle = {
  ...inputStyle,
  background:
    "#fff url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222.4%22><path d=%22M2 4l4 4 4-4%22/></svg>') no-repeat right 12px center",
} as const;

const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#46566e", marginBottom: 6 } as const;

const TR_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

// Date picker as three clean dropdowns (Gün / Ay / Yıl). Keeps the three parts
// in local state so partial selections stick; emits an ISO string "YYYY-MM-DD"
// to the parent once all three are chosen (else ""). `mode` sets the year range:
// "past" for birth dates, "future" for upcoming travel dates.
function DropdownDateField({
  value,
  onChange,
  mode,
}: {
  value: string;
  onChange: (v: string) => void;
  mode: "past" | "future";
}) {
  const init = value ? value.split("-") : [];
  const [y, setY] = useState(init[0] ?? "");
  const [m, setM] = useState(init[1] ? String(Number(init[1])) : "");
  const [d, setD] = useState(init[2] ? String(Number(init[2])) : "");

  const thisYear = new Date().getFullYear();
  const years: number[] = [];
  if (mode === "past") {
    for (let yr = thisYear - 16; yr >= thisYear - 100; yr--) years.push(yr);
  } else {
    for (let yr = thisYear; yr <= thisYear + 3; yr++) years.push(yr);
  }

  const daysInMonth = y && m ? new Date(Number(y), Number(m), 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const emit = (nd: string, nm: string, ny: string) => {
    onChange(nd && nm && ny ? `${ny}-${nm.padStart(2, "0")}-${nd.padStart(2, "0")}` : "");
  };

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <select
        aria-label="Gün"
        className="mv-input"
        style={{ ...selectStyle, flex: "0 0 30%" }}
        value={d}
        onChange={(e) => { setD(e.target.value); emit(e.target.value, m, y); }}
      >
        <option value="">Gün</option>
        {days.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <select
        aria-label="Ay"
        className="mv-input"
        style={{ ...selectStyle, flex: "1 1 auto" }}
        value={m}
        onChange={(e) => { setM(e.target.value); emit(d, e.target.value, y); }}
      >
        <option value="">Ay</option>
        {TR_MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
      </select>
      <select
        aria-label="Yıl"
        className="mv-input"
        style={{ ...selectStyle, flex: "0 0 30%" }}
        value={y}
        onChange={(e) => { setY(e.target.value); emit(d, m, e.target.value); }}
      >
        <option value="">Yıl</option>
        {years.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}

export function ApplyWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);
  const [w, setW] = useState<Wizard>({
    fullName: "", email: "", phone: "", dob: "", gender: "",
    nationality: "", passport: "", passportExpiry: "", employment: "",
    addressLine1: "", addressLine2: "", city: "", state: "",
    destination: "", visaCenter: "", purpose: "", sponsor: "",
    accommodation: "", hasChildren: "", persons: "1", travelDate: "", duration: "",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

  const set = (name: keyof Wizard, value: string) => {
    setW((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  // Validation — ported from validate() in MyVisa.dc.html.
  const validate = (n: number): Errors => {
    const e: Errors = {};
    if (n === 1) {
      if (!w.fullName.trim()) e.fullName = "Lütfen adınızı ve soyadınızı girin";
      if (!/^\S+@\S+\.\S+$/.test(w.email)) e.email = "Geçerli bir e-posta adresi girin";
      if (!w.phone.trim()) e.phone = "Telefon numaranızı girin";
      if (!w.dob) e.dob = "Doğum tarihi gereklidir";
      if (!w.gender) e.gender = "Cinsiyet seçin";
      if (!w.nationality) e.nationality = "Uyruğunuzu seçin";
      if (!w.passport.trim()) e.passport = "Pasaport numaranızı girin";
      if (!w.passportExpiry) e.passportExpiry = "Pasaport geçerlilik tarihini seçin";
      if (!w.employment) e.employment = "Çalışma durumunuzu seçin";
      if (!w.addressLine1.trim()) e.addressLine1 = "Adresinizi girin";
      if (!w.city.trim()) e.city = "Şehrinizi girin";
    }
    if (n === 2) {
      if (!w.destination) e.destination = "Bir destinasyon seçin";
      if (!w.visaCenter) e.visaCenter = "Bir vize merkezi seçin";
      if (!w.purpose) e.purpose = "Bir seyahat amacı seçin";
      if (!w.sponsor) e.sponsor = "Seyahatinizi kimin karşıladığını seçin";
      if (!w.accommodation) e.accommodation = "Konaklama türünü seçin";
      if (!w.hasChildren) e.hasChildren = "Lütfen seçin";
      const persons = Number(w.persons);
      if (!w.persons || !Number.isInteger(persons) || persons < 1) e.persons = "Kişi sayısı en az 1 olmalı";
      if (!w.travelDate) e.travelDate = "Seyahat tarihinizi seçin";
      if (!w.duration.trim()) e.duration = "Kaç gün kalacağınızı girin";
    }
    if (n === 3) {
      if (uploads.length < 2) e.uploads = "Lütfen en azından pasaportunuzu ve bir fotoğraf ekleyin";
    }
    if (n === 5) {
      if (!w.cardName.trim()) e.cardName = "Kart üzerindeki ad gereklidir";
      if (w.cardNumber.replace(/\s/g, "").length < 12) e.cardNumber = "Geçerli bir kart numarası girin";
      if (!w.expiry.trim()) e.expiry = "Gerekli";
      if (w.cvv.trim().length < 3) e.cvv = "Gerekli";
    }
    return e;
  };

  const next = async () => {
    const e = validate(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (step === 5) {
      await submit();
      return;
    }
    setStep((s) => s + 1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
    setErrors({});
    window.scrollTo(0, 0);
  };

  const goStep = (n: number) => {
    if (n < step) {
      setStep(n);
      setErrors({});
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((e) => ({ ...e, uploads: `${file.name} çok büyük (en fazla 5 MB).` }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = String(reader.result).split(",")[1] ?? "";
        setUploads((u) => [...u, { name: file.name, size: humanSize(file.size), mime: file.type, dataBase64: base64 }]);
        setErrors((e) => ({ ...e, uploads: undefined }));
      };
      reader.readAsDataURL(file);
    });
  };
  const removeUpload = (i: number) => setUploads((u) => u.filter((_, x) => x !== i));

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: w.fullName, email: w.email, phone: w.phone, dob: w.dob, gender: w.gender,
          nationality: w.nationality, passport: w.passport, passportExpiry: w.passportExpiry,
          employment: w.employment, addressLine1: w.addressLine1, addressLine2: w.addressLine2,
          city: w.city, state: w.state, destination: w.destination, visaCenter: w.visaCenter,
          purpose: w.purpose, sponsor: w.sponsor, accommodation: w.accommodation,
          hasChildren: w.hasChildren === "Evet",
          persons: Number(w.persons) || 1,
          travelDate: w.travelDate, duration: w.duration, plan: SERVICE_PLAN_NAME,
          documents: uploads.map((u) => ({ name: u.name, mime: u.mime, dataBase64: u.dataBase64 })),
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      const data = (await res.json()) as { ref: string };
      setDoneRef(data.ref);
      setStep(6);
      window.scrollTo(0, 0);
      router.refresh();
      toast(`Başvurunuz alındı ✓ Referans: ${data.ref}`, "success");
    } catch {
      setErrors({ submit: "Başvurunuz gönderilirken bir hata oluştu. Lütfen tekrar deneyin." });
      toast("Başvurunuz gönderilemedi. Lütfen tekrar deneyin.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const cur = Math.min(step, 5);

  if (step === 6) return <DoneScreen reference={doneRef} />;

  return (
    <div className="mv-apply-wrap" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.025em", color: "#0A1F3C", margin: 0 }}>
          Başvurunuzu başlatın
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", margin: "10px 0 0" }}>
          Yaklaşık iki dakika sürer. İlerlemeniz otomatik kaydedilir.
        </p>
      </div>

      {/* Compact stepper (phones) */}
      <div className="mv-stepper-mini" style={{ margin: "28px 0 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: "#0A1F3C" }}>
            Adım {cur}/5 · {STEP_LABELS[cur - 1]}
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>{Math.round(((cur - 1) / 4) * 100)}%</span>
        </div>
        <div style={{ height: 6, background: "#e2eaf2", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: 6, width: `${((cur - 1) / 4) * 100}%`, background: "#10b981", borderRadius: 6, transition: "width .3s ease" }} />
        </div>
      </div>

      {/* Stepper */}
      <div className="mv-stepper-full" style={{ position: "relative", margin: "40px 0 28px", padding: "0 8px" }}>
        <div style={{ position: "absolute", top: 17, left: 32, right: 32, height: 3, background: "#e2eaf2", borderRadius: 3 }} />
        <div style={{ position: "absolute", top: 17, left: 32, width: `calc((100% - 64px) * ${(cur - 1) / 4})`, height: 3, background: "#10b981", borderRadius: 3, transition: "width .3s ease" }} />
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < cur;
            const current = n === cur;
            return (
              <button
                key={label}
                onClick={() => goStep(n)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  background: "none", border: "none", cursor: n < step ? "pointer" : "default", padding: 0, width: 80,
                }}
              >
                <span
                  style={{
                    width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700,
                    background: done || current ? "#10b981" : "#fff",
                    color: done || current ? "#fff" : "#94a3b8",
                    border: done || current ? "none" : "1px solid #dbe3ec",
                    boxShadow: current ? "0 6px 16px rgba(16,185,129,.3)" : "none",
                  }}
                >
                  {done ? <Icon name="check" size={16} stroke="#fff" width={2.8} /> : n}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: current ? 700 : 500, color: current ? "#0A1F3C" : "#94a3b8" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step card */}
      <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 20, padding: 32, boxShadow: "0 1px 3px rgba(10,31,60,.05), 0 14px 40px rgba(10,31,60,.06)" }}>
        {step === 1 && <StepPersonal w={w} set={set} errors={errors} />}
        {step === 2 && <StepTravel w={w} set={set} errors={errors} />}
        {step === 3 && (
          <StepDocuments uploads={uploads} addFiles={addFiles} removeUpload={removeUpload} error={errors.uploads} />
        )}
        {step === 4 && <StepReview w={w} uploads={uploads} />}
        {step === 5 && <StepPayment w={w} set={set} errors={errors} />}

        {errors.submit && (
          <div style={{ marginTop: 18, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5, padding: "12px 14px", borderRadius: 10 }}>
            {errors.submit}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          {step > 1 && (
            <button
              onClick={prev}
              className="mv-btn-ghost"
              style={{ background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 14.5, padding: "13px 22px", borderRadius: 11, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon name="chevronLeft" size={16} width={2.2} /> Geri
            </button>
          )}
          <button
            onClick={next}
            disabled={submitting}
            className="mv-btn-emerald"
            style={{ flex: 1, background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, padding: 14, borderRadius: 12, cursor: submitting ? "wait" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, opacity: submitting ? 0.75 : 1, boxShadow: "0 8px 20px rgba(16,185,129,.3)" }}
          >
            {step === 5 ? (submitting ? "İşleniyor…" : `${priceForPersons(Number(w.persons)).totalLabel} öde ve gönder`) : "Devam et"}
            {step < 5 && <Icon name="arrowRight" size={17} stroke="#fff" width={2.4} />}
          </button>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 12.5, color: "#94a3b8", marginTop: 18 }}>
        🔒 Bilgileriniz şifrelenir. MyVisa bağımsız bir danışmanlık hizmetidir ve vize düzenlemez.
      </p>
    </div>
  );
}

/* ── Reusable field ── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 12.5, color: "#dc2626", marginTop: 5 }}>{error}</div>}
    </div>
  );
}

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A1F3C", margin: 0, letterSpacing: "-.01em" }}>{title}</h2>
      <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0" }}>{sub}</p>
    </div>
  );
}

type StepProps = { w: Wizard; set: (k: keyof Wizard, v: string) => void; errors: Errors };

function StepPersonal({ w, set, errors }: StepProps) {
  return (
    <>
      <StepHeader title="Kişisel bilgiler" sub="Kimin seyahat ettiğini belirtin. Bu bilgiler pasaportunuzla aynı olmalıdır." />
      <div style={{ display: "grid", gap: 16 }}>
        <Field label="Ad soyad (pasaporttaki gibi)" error={errors.fullName}>
          <input className="mv-input" style={inputStyle} value={w.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="örn. Ayşe Yılmaz" />
        </Field>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="E-posta adresi" error={errors.email}>
            <input className="mv-input" style={inputStyle} value={w.email} onChange={(e) => set("email", e.target.value)} placeholder="siz@eposta.com" />
          </Field>
          <Field label="Telefon" error={errors.phone}>
            <input className="mv-input" style={inputStyle} value={w.phone} onChange={(e) => set("phone", e.target.value)} placeholder="örn. +90 5xx xxx xx xx" inputMode="tel" />
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Doğum tarihi" error={errors.dob}>
            <DropdownDateField value={w.dob} onChange={(v) => set("dob", v)} mode="past" />
          </Field>
          <Field label="Cinsiyet" error={errors.gender}>
            <select className="mv-input" style={selectStyle} value={w.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Seçin</option>
              {genders.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Uyruk" error={errors.nationality}>
            <select className="mv-input" style={selectStyle} value={w.nationality} onChange={(e) => set("nationality", e.target.value)}>
              <option value="">Ülkenizi seçin</option>
              {countries.map((c) => <option key={c.code} value={c.name}>{trCountry(c.name)}</option>)}
            </select>
          </Field>
          <Field label="Çalışma durumu" error={errors.employment}>
            <select className="mv-input" style={selectStyle} value={w.employment} onChange={(e) => set("employment", e.target.value)}>
              <option value="">Seçin</option>
              {employmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Pasaport numarası" error={errors.passport}>
            <input className="mv-input" style={inputStyle} value={w.passport} onChange={(e) => set("passport", e.target.value)} placeholder="örn. P4521889" />
          </Field>
          <Field label="Pasaport geçerlilik tarihi" error={errors.passportExpiry}>
            <DropdownDateField value={w.passportExpiry} onChange={(v) => set("passportExpiry", v)} mode="future" />
          </Field>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#94a3b8", marginTop: 6 }}>Adres</div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Adres satırı 1" error={errors.addressLine1}>
            <input className="mv-input" style={inputStyle} value={w.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} placeholder="Mahalle, cadde, no" />
          </Field>
          <Field label="Adres satırı 2 (isteğe bağlı)">
            <input className="mv-input" style={inputStyle} value={w.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} placeholder="Daire, kat vb." />
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Şehir" error={errors.city}>
            <input className="mv-input" style={inputStyle} value={w.city} onChange={(e) => set("city", e.target.value)} placeholder="örn. İstanbul" />
          </Field>
          <Field label="İl / Eyalet (isteğe bağlı)">
            <input className="mv-input" style={inputStyle} value={w.state} onChange={(e) => set("state", e.target.value)} placeholder="örn. Marmara" />
          </Field>
        </div>
      </div>
    </>
  );
}

function StepTravel({ w, set, errors }: StepProps) {
  const centers = visaCenters.Turkey ?? [];
  return (
    <>
      <StepHeader title="Seyahatiniz" sub="Nereye ve neden gidiyorsunuz? Kontrol listenizi buna göre uyarlıyoruz." />
      <div style={{ display: "grid", gap: 16 }}>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Destinasyon" error={errors.destination}>
            <select className="mv-input" style={selectStyle} value={w.destination} onChange={(e) => set("destination", e.target.value)}>
              <option value="">Nereye gidiyorsunuz?</option>
              {destinationOpts.map((c) => <option key={c.code} value={c.name}>{trCountry(c.name)}</option>)}
            </select>
          </Field>
          <Field label="Vize başvuru merkezi" error={errors.visaCenter}>
            <select className="mv-input" style={selectStyle} value={w.visaCenter} onChange={(e) => set("visaCenter", e.target.value)}>
              <option value="">Bir şehir seçin</option>
              {centers.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Seyahat amacı" error={errors.purpose}>
            <select className="mv-input" style={selectStyle} value={w.purpose} onChange={(e) => set("purpose", e.target.value)}>
              <option value="">Bir amaç seçin</option>
              {purposes.map((p) => <option key={p} value={p}>{purposeTR[p] ?? p}</option>)}
            </select>
          </Field>
          <Field label="Seyahatinizi kim karşılıyor?" error={errors.sponsor}>
            <select className="mv-input" style={selectStyle} value={w.sponsor} onChange={(e) => set("sponsor", e.target.value)}>
              <option value="">Seçin</option>
              {sponsors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Nerede kalacaksınız?" error={errors.accommodation}>
            <select className="mv-input" style={selectStyle} value={w.accommodation} onChange={(e) => set("accommodation", e.target.value)}>
              <option value="">Seçin</option>
              {accommodations.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Yanınızda çocuk seyahat ediyor mu?" error={errors.hasChildren}>
            <select className="mv-input" style={selectStyle} value={w.hasChildren} onChange={(e) => set("hasChildren", e.target.value)}>
              <option value="">Seçin</option>
              <option value="Hayır">Hayır</option>
              <option value="Evet">Evet</option>
            </select>
          </Field>
        </div>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Planlanan seyahat tarihi" error={errors.travelDate}>
            <DropdownDateField value={w.travelDate} onChange={(v) => set("travelDate", v)} mode="future" />
          </Field>
          <Field label="Kalış süresi (gün)" error={errors.duration}>
            <input className="mv-input" style={inputStyle} value={w.duration} onChange={(e) => set("duration", e.target.value)} placeholder="örn. 21" inputMode="numeric" />
          </Field>
        </div>
        <Field label="Kaç kişi başvuracak?" error={errors.persons}>
          <input
            className="mv-input"
            style={inputStyle}
            value={w.persons}
            onChange={(e) => set("persons", e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="örn. 2"
            inputMode="numeric"
          />
          <PersonsHint persons={w.persons} />
        </Field>
      </div>
    </>
  );
}

// Live per-person + total breakdown shown under the group-size input.
function PersonsHint({ persons }: { persons: string }) {
  const n = Number(persons);
  if (!persons || !Number.isInteger(n) || n < 1) return null;
  const p = priceForPersons(n);
  return (
    <div style={{ marginTop: 8, fontSize: 13, color: "#059669", fontWeight: 600 }}>
      {p.perPersonLabel}/kişi × {p.persons} = <span style={{ color: "#065f46", fontWeight: 800 }}>{p.totalLabel} toplam</span>
      {n < 10 && (
        <span style={{ color: "#94a3b8", fontWeight: 500 }}>
          {" "}· {n < 5 ? "5+ kişide €335/kişi" : "10+ kişide €285/kişi"}
        </span>
      )}
    </div>
  );
}

function StepDocuments({
  uploads, addFiles, removeUpload, error,
}: { uploads: Upload[]; addFiles: (f: FileList | null) => void; removeUpload: (i: number) => void; error?: string }) {
  return (
    <>
      <StepHeader title="Belgelerinizi yükleyin" sub={`Önerilen belgeler: ${SUGGESTED.join(", ")}. Dosya başına en fazla 5 MB.`} />
      {uploads.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {uploads.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid #e2eaf2", borderRadius: 12, background: "#f8fafc" }}>
              <span style={{ width: 36, height: 36, borderRadius: 9, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <Icon name="file" size={18} stroke="#10b981" width={2} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1F3C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{u.size}</div>
              </div>
              <button onClick={() => removeUpload(i)} aria-label="Kaldır" style={{ width: 30, height: 30, borderRadius: 8, background: "#fff", border: "1px solid #e2eaf2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <Icon name="x" size={15} stroke="#94a3b8" width={2.4} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label style={{ display: "block", border: "2px dashed #dbe3ec", borderRadius: 14, padding: 26, textAlign: "center", cursor: "pointer" }}>
        <input type="file" multiple accept="image/*,application/pdf" style={{ display: "none" }} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        <span style={{ width: 44, height: 44, borderRadius: 12, background: "#ecfdf5", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="upload" size={20} stroke="#10b981" width={2} />
        </span>
        <p style={{ fontSize: 14.5, color: "#0A1F3C", fontWeight: 600, margin: "12px 0 4px" }}>Dosya seçmek için tıklayın</p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>PDF veya görsel · en fazla 5 MB</p>
      </label>
      {error && <div style={{ fontSize: 12.5, color: "#dc2626", marginTop: 12 }}>{error}</div>}
    </>
  );
}

function StepReview({ w, uploads }: { w: Wizard; uploads: Upload[] }) {
  const fmt = (v: string, fb = "—") => (v && v.trim() ? v : fb);
  const fmtDate = (v: string, fb = "—") => {
    const p = v ? v.split("-") : [];
    if (p.length !== 3) return fb;
    return `${Number(p[2])} ${TR_MONTHS[Number(p[1]) - 1] ?? p[1]} ${p[0]}`;
  };
  const addr = [w.addressLine1, w.addressLine2, w.city, w.state].filter((p) => p && p.trim()).join(", ");
  const rows: [string, string][] = [
    ["Ad soyad", fmt(w.fullName)], ["E-posta", fmt(w.email)], ["Telefon", fmt(w.phone)],
    ["Doğum tarihi", fmtDate(w.dob)], ["Cinsiyet", fmt(w.gender)], ["Uyruk", w.nationality ? trCountry(w.nationality) : "—"],
    ["Pasaport no.", fmt(w.passport)], ["Pasaport geçerlilik", fmtDate(w.passportExpiry)], ["Çalışma durumu", fmt(w.employment)],
    ["Adres", fmt(addr)], ["Destinasyon", w.destination ? trCountry(w.destination) : "—"], ["Vize merkezi", fmt(w.visaCenter)],
    ["Amaç", w.purpose ? (purposeTR[w.purpose] ?? w.purpose) : "—"], ["Karşılayan", fmt(w.sponsor)], ["Konaklama", fmt(w.accommodation)],
    ["Çocuk seyahati", fmt(w.hasChildren)], ["Seyahat tarihi", fmtDate(w.travelDate)], ["Kalış süresi", w.duration ? `${w.duration} gün` : "—"],
    ["Kişi sayısı", w.persons ? `${Number(w.persons)} kişi` : "—"],
  ];
  return (
    <>
      <StepHeader title="Başvurunuzu inceleyin" sub="Ödemeden önce her şeyin doğru olduğunu kontrol edin. Düzenlemek için geri dönebilirsiniz." />
      <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 24 }}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "#0A1F3C" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Belgeler ({uploads.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {uploads.map((u, i) => (
            <span key={i} style={{ fontSize: 13, color: "#46566e", background: "#f1f6fb", border: "1px solid #e2eaf2", padding: "6px 11px", borderRadius: 8 }}>{u.name}</span>
          ))}
        </div>
      </div>
      <FeeSummary persons={w.persons} />
    </>
  );
}

function StepPayment({
  w, set, errors,
}: { w: Wizard; set: (k: keyof Wizard, v: string) => void; errors: Errors }) {
  return (
    <>
      <StepHeader title="Ödeme" sub="Tek seferlik MyVisa hizmet ücretini ödeyin. Resmi / konsolosluk harçları ayrıca ödenir." />
      <FeeSummary persons={w.persons} />
      <div style={{ display: "grid", gap: 16, marginTop: 22 }}>
        <Field label="Kart üzerindeki ad" error={errors.cardName}>
          <input className="mv-input" style={inputStyle} value={w.cardName} onChange={(e) => set("cardName", e.target.value)} placeholder="Ad soyad" />
        </Field>
        <Field label="Kart numarası" error={errors.cardNumber}>
          <input className="mv-input" style={inputStyle} value={w.cardNumber} onChange={(e) => set("cardNumber", e.target.value)} placeholder="4242 4242 4242 4242" inputMode="numeric" />
        </Field>
        <div className="mv-fieldgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Son kullanma (AA/YY)" error={errors.expiry}>
            <input className="mv-input" style={inputStyle} value={w.expiry} onChange={(e) => set("expiry", e.target.value)} placeholder="08/28" />
          </Field>
          <Field label="CVV" error={errors.cvv}>
            <input className="mv-input" style={inputStyle} value={w.cvv} onChange={(e) => set("cvv", e.target.value)} placeholder="123" inputMode="numeric" />
          </Field>
        </div>
      </div>
    </>
  );
}

function FeeSummary({ persons }: { persons: string }) {
  const p = priceForPersons(Number(persons) || 1);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: "16px 18px" }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#065f46" }}>MyVisa Tam Hizmet</div>
        <div style={{ fontSize: 12.5, color: "#059669", marginTop: 2 }}>
          {p.perPersonLabel}/kişi × {p.persons} kişi — her şey baştan sona halledilir.
        </div>
      </div>
      <span style={{ fontSize: 24, fontWeight: 800, color: "#065f46", letterSpacing: "-.02em" }}>{p.totalLabel}</span>
    </div>
  );
}

function DoneScreen({ reference }: { reference: string | null }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "72px 24px 96px", textAlign: "center" }}>
      <div className="mv-pop" style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 24, padding: "44px 36px", boxShadow: "0 20px 50px rgba(10,31,60,.1)" }}>
        <span style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(140deg,#10b981,#059669)", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(16,185,129,.34)" }}>
          <Icon name="check" size={36} stroke="#fff" width={2.6} />
        </span>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0A1F3C", margin: "24px 0 0", letterSpacing: "-.02em" }}>
          Başvuru gönderildi!
        </h1>
        <p style={{ fontSize: 15.5, color: "#64748b", margin: "12px 0 0", lineHeight: 1.6 }}>
          Ödeme onaylandı. Bir MyVisa uzmanı kısa süre içinde belgelerinizi incelemeye başlayacak — her adımı panelinizden takip edin.
        </p>
        {reference && (
          <div style={{ display: "inline-block", margin: "22px 0 0", background: "#f1f6fb", border: "1px solid #e2eaf2", borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 700, color: "#0A1F3C" }}>
            Referans: {reference}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <Link href="/dashboard" className="mv-btn-emerald" style={{ flex: 1, textAlign: "center", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 14.5, padding: 13, borderRadius: 11, textDecoration: "none" }}>
            Panele git
          </Link>
          <Link href="/" className="mv-btn-ghost" style={{ textAlign: "center", background: "#f1f6fb", color: "#0A1F3C", border: "1px solid #e2eaf2", fontWeight: 700, fontSize: 14.5, padding: "13px 20px", borderRadius: 11, textDecoration: "none" }}>
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}
