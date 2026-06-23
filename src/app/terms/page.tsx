import { LegalShell, H2, P, LI } from "@/components/Legal";

export const metadata = { title: "Kullanım Koşulları — MyVisa" };

export default function TermsPage() {
  return (
    <LegalShell title="Kullanım Koşulları" updated="23 Haziran 2026">
      <P>
        Bu Kullanım Koşulları (&quot;Koşullar&quot;), MyVisa.com (&quot;MyVisa&quot;, &quot;biz&quot;)
        web sitesini ve hizmetlerini kullanımınızı düzenler. Hizmeti kullanarak bu Koşulları kabul
        etmiş sayılırsınız.
      </P>

      <H2>1. Hizmetin tanımı</H2>
      <P>
        MyVisa, Türkiye&apos;den vize başvurusu yapan kişilere bağımsız vize danışmanlığı sunan bir
        hizmettir. Gereklilik kontrolü, belge hazırlığı, başvuru desteği ve süreç takibi sağlarız.
      </P>
      <P>
        <strong>MyVisa resmi bir kurum, konsolosluk veya büyükelçilik değildir ve vize
        düzenlemez.</strong> Vize verme veya reddetme kararı yalnızca ilgili ülkenin yetkili
        makamlarına aittir. MyVisa hiçbir vizenin onaylanacağını garanti etmez.
      </P>

      <H2>2. Ücretler ve ödeme</H2>
      <P>
        MyVisa hizmet bedeli başvuru başına tek ve sabit bir ücrettir (€375). Bu bedel, resmi
        / konsolosluk harçlarından ayrıdır; resmi harçlar gideceğiniz ülkeye göre değişir ve
        doğrudan ilgili makama ödenir. Ödeme, başvuru sırasında alınır.
      </P>

      <H2>3. Kullanıcı yükümlülükleri</H2>
      <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
        <LI>Sağladığınız tüm bilgilerin doğru, güncel ve size ait olduğunu taahhüt edersiniz.</LI>
        <LI>Yüklediğiniz belgelerin gerçek ve geçerli olmasından siz sorumlusunuz.</LI>
        <LI>Hizmeti yasalara aykırı veya hileli amaçlarla kullanamazsınız.</LI>
        <LI>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz.</LI>
      </ul>

      <H2>4. Sorumluluğun sınırlandırılması</H2>
      <P>
        MyVisa, eksiksiz ve hatasız bir başvuru hazırlamak için makul özeni gösterir; ancak vize
        sonucundan, işlem sürelerindeki gecikmelerden veya yetkili makamların kararlarından sorumlu
        tutulamaz. Hizmet &quot;olduğu gibi&quot; sunulur.
      </P>

      <H2>5. Fikri mülkiyet</H2>
      <P>
        Sitedeki tüm içerik, marka ve tasarım MyVisa&apos;ya aittir ve izinsiz kullanılamaz.
      </P>

      <H2>6. Değişiklikler</H2>
      <P>
        Bu Koşulları zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayınlanır.
      </P>

      <H2>7. Uygulanacak hukuk</H2>
      <P>
        Bu Koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri ve
        icra daireleri yetkilidir.
      </P>

      <H2>8. İletişim</H2>
      <P>
        Sorularınız için: <a href="mailto:support@myvisa.com" style={{ color: "#10b981", textDecoration: "none" }}>support@myvisa.com</a> veya{" "}
        <a href="/contact" style={{ color: "#10b981", textDecoration: "none" }}>iletişim sayfamız</a>.
      </P>

      <P style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 20 }}>
        Not: Bu metin bilgilendirme amaçlı bir şablondur. Yayına almadan önce bir hukuk danışmanına
        incelettirmeniz önerilir.
      </P>
    </LegalShell>
  );
}
