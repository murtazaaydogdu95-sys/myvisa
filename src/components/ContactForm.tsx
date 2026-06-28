"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #dbe3ec",
  borderRadius: 10,
  fontSize: 14.5,
  color: "#0c1a30",
  background: "#fff",
} as const;
const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#46566e", marginBottom: 6 } as const;

export function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || !message.trim()) {
      setError("Lütfen adınızı, geçerli bir e-posta ve bir mesaj girin.");
      toast("Lütfen adınızı, geçerli bir e-posta ve bir mesaj girin.", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      toast("Mesajınız gönderildi ✓ En kısa sürede dönüş yapacağız.", "success");
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      toast("Mesajınız gönderilemedi. Lütfen tekrar deneyin.", "error");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="mv-pop" style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 16, padding: 28, textAlign: "center" }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(140deg,#10b981,#059669)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={28} stroke="#fff" width={2.6} />
        </span>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#065f46", margin: "16px 0 0" }}>Mesaj gönderildi</h3>
        <p style={{ fontSize: 14.5, color: "#047857", margin: "8px 0 0" }}>
          Teşekkürler {name.split(" ")[0]} — bir MyVisa uzmanı bir iş günü içinde {email} adresine yanıt verecek.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <div>
        <label style={labelStyle}>Adınız</label>
        <input className="mv-input" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad soyad" />
      </div>
      <div>
        <label style={labelStyle}>E-posta adresi</label>
        <input className="mv-input" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="siz@eposta.com" />
      </div>
      <div>
        <label style={labelStyle}>Size nasıl yardımcı olabiliriz?</label>
        <textarea className="mv-input" style={{ ...inputStyle, minHeight: 130, resize: "vertical" }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Seyahatiniz veya sorunuz hakkında bize bilgi verin…" />
      </div>
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5, padding: "12px 14px", borderRadius: 10 }}>{error}</div>
      )}
      <button
        type="submit"
        disabled={sending}
        className="mv-btn-emerald"
        style={{ background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, padding: 14, borderRadius: 12, cursor: sending ? "wait" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, opacity: sending ? 0.75 : 1, boxShadow: "0 8px 20px rgba(16,185,129,.3)" }}
      >
        {sending ? "Gönderiliyor…" : "Mesaj gönder"}
        {!sending && <Icon name="arrowRight" size={17} stroke="#fff" width={2.4} />}
      </button>
    </form>
  );
}
