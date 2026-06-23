import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Icon, type IconName } from "@/components/Icon";

export const metadata = { title: "İletişim — MyVisa" };

const points: { icon: IconName; title: string; body: string }[] = [
  { icon: "mail", title: "Bize e-posta gönderin", body: "support@myvisa.com — bir iş günü içinde yanıt." },
  { icon: "phone", title: "Bir uzmanı arayın", body: "+90 212 000 0000, Pzt–Cum 09:00–18:00." },
  { icon: "clock", title: "Hızlı süreç", body: "Çoğu başvuru, gönderimden sonra 24 saat içinde incelenmeye başlar." },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="mv-contact" style={{ background: "#F5F7FA" }}>
        <section style={{ background: "linear-gradient(165deg,#071529,#0A1F3C)", padding: "72px 24px 96px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#10b981" }}>
              İletişim
            </span>
            <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-.03em", color: "#fff", margin: "12px 0 0" }}>
              Size yardımcı olmak için buradayız
            </h1>
            <p style={{ fontSize: 17.5, color: "#9fb2cc", margin: "16px auto 0", maxWidth: 560, lineHeight: 1.6 }}>
              Vizeniz, belgeleriniz veya mevcut bir başvuru hakkında sorularınız mı var? Bize bir mesaj gönderin, bir uzman size geri dönsün.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 1000, margin: "-56px auto 0", padding: "0 24px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" }} className="mv-compare">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {points.map((p) => (
                <div key={p.title} style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={p.icon} size={21} stroke="#10b981" width={2} />
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A1F3C", margin: "14px 0 6px" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.55 }}>{p.body}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 20, padding: 32, boxShadow: "0 14px 40px rgba(10,31,60,.08)" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A1F3C", margin: "0 0 6px" }}>Bize mesaj gönderin</h2>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 22px" }}>Genellikle bir iş günü içinde yanıt veririz.</p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
