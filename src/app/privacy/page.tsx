import { LegalShell, H2, P, LI } from "@/components/Legal";

export const metadata = { title: "Gizlilik Politikası — MyVisa" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Gizlilik Politikası ve KVKK Aydınlatma Metni" updated="23 Haziran 2026">
      <P>
        MyVisa.com (&quot;MyVisa&quot;, &quot;veri sorumlusu&quot;) olarak kişisel verilerinizin
        gizliliğine önem veriyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu
        (&quot;KVKK&quot;) kapsamında verilerinizi nasıl işlediğimizi açıklar.
      </P>

      <H2>1. İşlenen kişisel veriler</H2>
      <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
        <LI><strong>Kimlik ve iletişim:</strong> ad soyad, doğum tarihi, uyruk, e-posta, telefon.</LI>
        <LI><strong>Seyahat ve başvuru:</strong> pasaport numarası, gideceğiniz ülke, vize türü, seyahat tarihi, kalış süresi.</LI>
        <LI><strong>Belgeler:</strong> pasaport, fotoğraf, banka ekstresi ve yüklediğiniz destekleyici dosyalar.</LI>
        <LI><strong>İşlem verileri:</strong> ödeme durumu, işlem kimliği (kart bilgileri tarafımızca saklanmaz).</LI>
        <LI><strong>Teknik veriler:</strong> oturum çerezleri ve temel kullanım kayıtları.</LI>
      </ul>

      <H2>2. İşleme amaçları ve hukuki sebep</H2>
      <P>
        Verileriniz; vize başvurunuzu hazırlamak, belgelerinizi incelemek, sürecinizi yönetmek,
        sizinle iletişim kurmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla işlenir.
        Hukuki sebep, sözleşmenin ifası ve açık rızanızdır (KVKK m. 5).
      </P>

      <H2>3. Verilerin aktarılması</H2>
      <P>
        Belgeleriniz yalnızca başvurunuzun gerektirdiği ilgili konsolosluk, büyükelçilik veya yetkili
        vize başvuru merkezleriyle (ör. iData/VFS) ve hizmetin sağlanması için gerekli altyapı
        sağlayıcılarımızla paylaşılır. Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz.
      </P>

      <H2>4. Saklama süresi</H2>
      <P>
        Kişisel verileriniz, başvuru süreciniz boyunca ve ilgili yasal saklama süreleri kapsamında
        tutulur; bu sürelerin sonunda silinir veya anonim hale getirilir.
      </P>

      <H2>5. Veri güvenliği</H2>
      <P>
        Verileriniz aktarım sırasında ve saklanırken sektör standardı şifreleme ile korunur. Erişim,
        yalnızca yetkili personelle sınırlıdır.
      </P>

      <H2>6. KVKK kapsamındaki haklarınız</H2>
      <P>KVKK m. 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya
        silinmesini isteme, işlemeye itiraz etme ve verilerinizin bir kopyasını talep etme
        haklarına sahipsiniz. Talepleriniz için bizimle iletişime geçebilirsiniz.</P>

      <H2>7. Çerezler</H2>
      <P>
        Site yalnızca oturumunuzu sürdürmek için gerekli (zorunlu) çerezleri kullanır. Bunlar,
        giriş yaptığınızda kimliğinizi korur ve takip/reklam amacı taşımaz.
      </P>

      <H2>8. İletişim</H2>
      <P>
        Veri sorumlusu: MyVisa.com — <a href="mailto:support@myvisa.com" style={{ color: "#10b981", textDecoration: "none" }}>support@myvisa.com</a>.
        Talepleriniz için <a href="/contact" style={{ color: "#10b981", textDecoration: "none" }}>iletişim sayfamızı</a> kullanabilirsiniz.
      </P>

      <P style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 20 }}>
        Not: Bu metin bilgilendirme amaçlı bir şablondur. Yayına almadan önce bir hukuk danışmanına
        incelettirmeniz önerilir.
      </P>
    </LegalShell>
  );
}
