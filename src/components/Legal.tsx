import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F7FA" }}>
        <section style={{ background: "linear-gradient(165deg,#071529,#0A1F3C)", padding: "64px 24px 84px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.03em", color: "#fff", margin: 0 }}>{title}</h1>
            <p style={{ fontSize: 14.5, color: "#9fb2cc", margin: "12px 0 0" }}>Son güncelleme: {updated}</p>
          </div>
        </section>
        <section style={{ maxWidth: 820, margin: "-44px auto 0", padding: "0 24px 80px" }}>
          <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 20, padding: "36px 38px", boxShadow: "0 14px 40px rgba(10,31,60,.08)" }}>
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0A1F3C", margin: "28px 0 10px", letterSpacing: "-.01em" }}>{children}</h2>;
}

export function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 14.5, color: "#46566e", lineHeight: 1.7, margin: "0 0 12px", ...style }}>{children}</p>;
}

export function LI({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 14.5, color: "#46566e", lineHeight: 1.7, marginBottom: 6 }}>{children}</li>;
}
