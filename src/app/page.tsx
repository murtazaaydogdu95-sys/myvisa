import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VisaChecker } from "@/components/VisaChecker";
import { Destinations } from "@/components/Destinations";
import { Faq } from "@/components/Faq";
import { Icon, type IconName } from "@/components/Icon";
import { PRICE_TIERS, formatEuro } from "@/lib/data";

const eyebrow = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#10b981",
} as const;
const sectionH2 = {
  fontSize: 40,
  fontWeight: 800,
  letterSpacing: "-.025em",
  color: "#0A1F3C",
  margin: "12px 0 0",
} as const;

const steps = [
  { n: "01", icon: "mapPin" as IconName, title: "Seyahatinizi anlatın", body: "Uyruğunuz, gideceğiniz ülke ve seyahat amacınız hakkında birkaç soruyu yanıtlayın.", accent: false },
  { n: "02", icon: "upload" as IconName, title: "Belgelerinizi yükleyin", body: "Kişiselleştirilmiş kontrol listesine göre pasaportunuzu, fotoğraflarınızı ve destekleyici dosyalarınızı güvenle ekleyin.", accent: false },
  { n: "03", icon: "clipboardCheck" as IconName, title: "Uzman incelemesi ve hazırlık", body: "Vize uzmanlarımız her ayrıntıyı kontrol eder ve başvurunuzu gönderime hazırlar.", accent: false },
  { n: "04", icon: "plane" as IconName, title: "Vize rehberinizi alın", body: "Adım adım gönderim talimatları alın ve seyahat gününe kadar onay sürecini takip edin.", accent: true },
];

const services: { icon: IconName; title: string; body: string }[] = [
  { icon: "search", title: "Vize uygunluk kontrolü", body: "Tek kuruş harcamadan hangi vizeye ihtiyacınız olduğunu ve uygun olup olmadığınızı anında görün." },
  { icon: "pencil", title: "Başvuru desteği", body: "Gideceğiniz ülkeye ve amacınıza uyarlanan rehberli formlarla hiçbir ayrıntı atlanmaz." },
  { icon: "fileCheck", title: "Belge incelemesi", body: "Uzmanlar, göndermeden önce her dosyayı konsolosluk gerekliliklerine göre doğrular." },
  { icon: "calendar", title: "Randevu rehberliği", body: "Konsolosluk veya biyometri randevularınızı güvenle alın ve hazırlanın." },
  { icon: "trending", title: "Başvuru takibi", body: "Gönderimden karara kadar gerçek zamanlı durum ve her aşamada güncellemeler." },
  { icon: "support", title: "Seyahat desteği", body: "Onaylandıktan sonra sigorta, seyahat planı ve giriş gereklilikleri konusunda yardım." },
];

const diy = [
  "Hangi vizeye ihtiyacınız olduğunu öğrenmek için saatlerce araştırma",
  "Küçük belge hataları maliyetli retlere yol açar",
  "Sürecin nerede olduğunu takip etmenin net bir yolu yok",
  "Bir şeyler ters giderse yalnızsınız",
];
const withUs = [
  "Anında uygunluk kontrolü — ilk dakikadan itibaren daha az kafa karışıklığı",
  "Gönderimden önce her belge bir uzman tarafından doğrulanır",
  "İstediğiniz zaman kontrol edebileceğiniz gerçek zamanlı durum zaman çizelgesi",
  "Her adımda size özel uzman desteği",
];

const planFeatures = [
  "Tam uygunluk kontrolü",
  "Kişiselleştirilmiş belge kontrol listesi",
  "Uzman belge incelemesi",
  "Rehberli başvuru desteği",
  "Size özel vize uzmanı",
  "Randevu alma rehberliği",
  "Bir ücretsiz yeniden gönderim",
  "Öncelikli 7/24 destek",
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mv-home">
        {/* HERO */}
        <section style={{ position: "relative", background: "linear-gradient(165deg,#071529 0%,#0A1F3C 52%,#0c2a4d 100%)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -80, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.22),transparent 68%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -160, left: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(33,96,170,.28),transparent 70%)", pointerEvents: "none" }} />
          <div className="mv-herogrid" style={{ maxWidth: 1200, margin: "0 auto", padding: "84px 24px 96px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 56, alignItems: "center", position: "relative" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,.14)", border: "1px solid rgba(16,185,129,.32)", color: "#6ee7b7", fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} /> 190+ ülkeden gezginlerin güveniyle
              </span>
              <h1 style={{ fontSize: 58, lineHeight: 1.04, fontWeight: 800, letterSpacing: "-.03em", color: "#fff", margin: "22px 0 0", textWrap: "balance" }}>
                Vize yolculuğunuz<br />artık çok{" "}
                <span style={{ background: "linear-gradient(120deg,#10b981,#5eead4)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>kolay</span>
              </h1>
              <p style={{ fontSize: 18.5, lineHeight: 1.6, color: "#9fb2cc", margin: "22px 0 0", maxWidth: 520 }}>
                Gereklilikleri kontrol edin, kusursuz belgeler hazırlayın ve her adımı takip edin — başvurudan onaya kadar vize uzmanlarının rehberliğinde.
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
                <Link href="/apply" className="mv-btn-emerald mv-btn-lift" style={{ background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 28px", borderRadius: 14, textDecoration: "none", boxShadow: "0 10px 26px rgba(16,185,129,.36)", display: "inline-flex", alignItems: "center", gap: 9 }}>
                  Başvuru Başlat
                  <Icon name="arrowRight" size={18} stroke="#fff" width={2.4} />
                </Link>
                <a href="#checker" className="mv-glass-btn" style={{ background: "rgba(255,255,255,.08)", color: "#fff", border: "1px solid rgba(255,255,255,.22)", fontWeight: 600, fontSize: 16, padding: "16px 26px", borderRadius: 14, textDecoration: "none", backdropFilter: "blur(6px)" }}>
                  Gereklilikleri Kontrol Et
                </a>
              </div>
              <div style={{ display: "flex", gap: 26, marginTop: 40, flexWrap: "wrap" }}>
                <Stat value="250B+" label="İşlenen başvuru" />
                <Divider />
                <Stat value="%98,6" label="Başarı oranı" />
                <Divider />
                <Stat value="190+" label="Desteklenen ülke" />
              </div>
            </div>
            <VisaChecker />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 24px 40px" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <span style={eyebrow}>Nasıl çalışır</span>
            <h2 style={sectionH2}>Vizenize dört adım</h2>
            <p style={{ fontSize: 17, color: "#64748b", margin: "14px 0 0", lineHeight: 1.6 }}>
              Karmaşık terimler ve tahmin yok. Kafa karıştırıcı bir süreci net, rehberli bir yola dönüştürüyoruz.
            </p>
          </div>
          <div className="mv-steps" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {steps.map((s) => (
              <div key={s.n} className="mv-card" style={{ position: "relative", background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: "26px 22px", boxShadow: "0 1px 3px rgba(10,31,60,.05), 0 10px 30px rgba(10,31,60,.05)" }}>
                <div style={{ position: "absolute", top: 18, right: 20, fontSize: 42, fontWeight: 800, color: "#eef4fb", letterSpacing: "-.03em" }}>{s.n}</div>
                <span style={{ width: 48, height: 48, borderRadius: 13, background: s.accent ? "linear-gradient(140deg,#10b981,#059669)" : "linear-gradient(140deg,#0A1F3C,#163b66)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={23} stroke={s.accent ? "#fff" : "#10b981"} width={2} />
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A1F3C", margin: "20px 0 8px", letterSpacing: "-.01em" }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 40px" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 52px" }}>
            <span style={eyebrow}>Ne yapıyoruz</span>
            <h2 style={sectionH2}>Vizeniz için ihtiyacınız olan her şey</h2>
          </div>
          <div className="mv-services" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {services.map((s) => (
              <div key={s.title} className="mv-card mv-card-sm" style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 28, boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
                <span style={{ width: 46, height: 46, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={22} stroke="#10b981" width={2} />
                </span>
                <h3 style={{ fontSize: 17.5, fontWeight: 700, color: "#0A1F3C", margin: "18px 0 7px" }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 40px" }}>
          <div className="mv-pad-lg" style={{ background: "linear-gradient(165deg,#071529,#0A1F3C)", borderRadius: 28, padding: "54px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -100, right: -60, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.18),transparent 70%)" }} />
            <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px", position: "relative" }}>
              <span style={eyebrow}>Neden MyVisa</span>
              <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-.025em", color: "#fff", margin: "12px 0 0" }}>
                Tek başına yapmak ile bizimle yapmak
              </h2>
            </div>
            <div className="mv-compare" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, position: "relative", maxWidth: 880, margin: "0 auto" }}>
              <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#9fb2cc", marginBottom: 20, display: "flex", alignItems: "center", gap: 9 }}>
                  <Icon name="xCircle" size={18} stroke="#64748b" width={2.2} /> Kendin yap başvurusu
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {diy.map((t) => (
                    <div key={t} style={{ display: "flex", gap: 11 }}>
                      <Icon name="x" size={18} stroke="#7e93af" width={2.2} style={{ flex: "none", marginTop: 1 }} />
                      <span style={{ fontSize: 14.5, color: "#9fb2cc", lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "linear-gradient(165deg,rgba(16,185,129,.16),rgba(16,185,129,.06))", border: "1px solid rgba(16,185,129,.4)", borderRadius: 20, padding: 28, boxShadow: "0 20px 50px rgba(16,185,129,.14)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#6ee7b7", marginBottom: 20, display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check" size={13} stroke="#fff" width={3} />
                  </span>{" "}
                  MyVisa ile
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {withUs.map((t) => (
                    <div key={t} style={{ display: "flex", gap: 11 }}>
                      <Icon name="check" size={18} stroke="#10b981" width={2.4} style={{ flex: "none", marginTop: 1 }} />
                      <span style={{ fontSize: 14.5, color: "#d6e3f0", lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESTINATIONS */}
        <Destinations />

        {/* PRICING */}
        <section id="pricing" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 40px" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 52px" }}>
            <span style={eyebrow}>Fiyatlandırma</span>
            <h2 style={sectionH2}>Ne kadar kalabalık, o kadar uygun</h2>
            <p style={{ fontSize: 17, color: "#64748b", margin: "14px 0 0", lineHeight: 1.6 }}>
              Kişi başına net ücret — grubunuz büyüdükçe kişi başı fiyat düşer. Abonelik yok,
              sürpriz yok. Resmi harçlar ayrıca gösterilir.
            </p>
          </div>

          <div className="mv-price-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, alignItems: "stretch" }}>
            {PRICE_TIERS.map((t, i) => {
              const featured = i === 1; // highlight the middle tier
              return (
                <div
                  key={t.label}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: featured ? "linear-gradient(170deg,#0A1F3C,#0c2a4d)" : "#fff",
                    border: featured ? "1px solid #0A1F3C" : "1px solid #e8edf4",
                    borderRadius: 22,
                    padding: "30px 26px",
                    boxShadow: featured ? "0 24px 60px rgba(10,31,60,.3)" : "0 1px 3px rgba(10,31,60,.06)",
                    transform: featured ? "translateY(-6px)" : "none",
                  }}
                >
                  {featured && <div style={{ position: "absolute", top: -90, right: -50, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.2),transparent 70%)" }} />}
                  {featured && (
                    <span style={{ position: "relative", alignSelf: "flex-start", display: "inline-block", background: "#10b981", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 999, letterSpacing: ".03em", marginBottom: 14 }}>
                      EN POPÜLER
                    </span>
                  )}
                  <div style={{ position: "relative", fontSize: 15, fontWeight: 700, color: featured ? "#9fb2cc" : "#64748b" }}>{t.label}</div>
                  <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 5, marginTop: 10 }}>
                    <span style={{ fontSize: 44, fontWeight: 800, color: featured ? "#fff" : "#0A1F3C", letterSpacing: "-.02em" }}>{formatEuro(t.perPerson)}</span>
                    <span style={{ fontSize: 14.5, color: featured ? "#7e93af" : "#94a3b8" }}>/ kişi</span>
                  </div>
                  <p style={{ position: "relative", fontSize: 13, color: featured ? "#9fb2cc" : "#94a3b8", margin: "8px 0 0", lineHeight: 1.5 }}>
                    {t.max === Infinity ? `${t.min} kişi ve üzeri gruplar için kişi başı ücret.` : `${t.min}–${t.max} kişilik gruplar için kişi başı ücret.`}
                  </p>
                  <Link
                    href="/apply"
                    className="mv-btn-emerald"
                    style={{ position: "relative", display: "block", textAlign: "center", width: "100%", margin: "20px 0 0", background: featured ? "#10b981" : "#0A1F3C", color: "#fff", fontWeight: 700, fontSize: 14.5, padding: 13, borderRadius: 11, textDecoration: "none", boxShadow: featured ? "0 8px 20px rgba(16,185,129,.34)" : "none" }}
                  >
                    Başla
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ maxWidth: 1000, margin: "28px auto 0", background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: "26px 28px", boxShadow: "0 1px 3px rgba(10,31,60,.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#10b981", marginBottom: 16 }}>Her pakette dahil</div>
            <div className="mv-fee-features" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px 24px" }}>
              {planFeatures.map((f) => (
                <div key={f} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "#46566e", alignItems: "flex-start" }}>
                  <Icon name="check" size={16} stroke="#10b981" width={2.6} style={{ flex: "none", marginTop: 1 }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 16 }}>
            Resmi / konsolosluk harçları ayrıca ödenir ve gideceğiniz ülkeye göre değişir.
          </p>
        </section>

        {/* FAQ */}
        <Faq />

        {/* CTA */}
        <section style={{ maxWidth: 1200, margin: "48px auto 0", padding: "0 24px 80px" }}>
          <div className="mv-pad-lg" style={{ background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: 28, padding: "56px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(circle at 15% 20%, rgba(255,255,255,.22), transparent 40%)" }} />
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-.025em", margin: 0, position: "relative" }}>
              Vize yolculuğunuza başlamaya hazır mısınız?
            </h2>
            <p style={{ fontSize: 17, color: "#d1fae5", margin: "14px 0 0", position: "relative" }}>
              İki dakikadan kısa sürede anında uygunluk kontrolü yapın.
            </p>
            <Link href="/apply" className="mv-btn-navy mv-btn-lift" style={{ display: "inline-block", marginTop: 28, background: "#0A1F3C", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 32px", borderRadius: 14, textDecoration: "none", position: "relative", boxShadow: "0 12px 30px rgba(10,31,60,.3)" }}>
              Başvuru Başlat
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#7e93af", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: "rgba(255,255,255,.12)" }} />;
}
