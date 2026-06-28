// Static reference data — ported verbatim from MyVisa.dc.html's <script> block.
// This is configuration, not user data, so it lives in code rather than the DB.

export type Country = { name: string; code: string; url: string };

const flag = (code: string) => `https://flagcdn.com/w40/${code}.png`;

export const countries: Country[] = [
  { name: "United Kingdom", code: "gb", url: flag("gb") },
  { name: "United States", code: "us", url: flag("us") },
  { name: "India", code: "in", url: flag("in") },
  { name: "Nigeria", code: "ng", url: flag("ng") },
  { name: "Germany", code: "de", url: flag("de") },
  { name: "Canada", code: "ca", url: flag("ca") },
  { name: "Australia", code: "au", url: flag("au") },
  { name: "Brazil", code: "br", url: flag("br") },
  { name: "Philippines", code: "ph", url: flag("ph") },
  { name: "South Africa", code: "za", url: flag("za") },
  { name: "United Arab Emirates", code: "ae", url: flag("ae") },
  { name: "Japan", code: "jp", url: flag("jp") },
  { name: "France", code: "fr", url: flag("fr") },
  { name: "Pakistan", code: "pk", url: flag("pk") },
  { name: "Kenya", code: "ke", url: flag("ke") },
];

// MyVisa currently serves applicants applying from Turkey only.
export const originCountries: Country[] = [
  { name: "Turkey", code: "tr", url: flag("tr") },
];

// Destinations available when applying from Turkey (per xvisa's Turkey routes).
export const destinationOpts: Country[] = [
  { name: "Bulgaria", code: "bg", url: flag("bg") },
  { name: "Croatia", code: "hr", url: flag("hr") },
  { name: "Czech Republic", code: "cz", url: flag("cz") },
  { name: "Denmark", code: "dk", url: flag("dk") },
  { name: "Estonia", code: "ee", url: flag("ee") },
  { name: "Finland", code: "fi", url: flag("fi") },
  { name: "France", code: "fr", url: flag("fr") },
  { name: "Latvia", code: "lv", url: flag("lv") },
  { name: "Lithuania", code: "lt", url: flag("lt") },
  { name: "Luxembourg", code: "lu", url: flag("lu") },
  { name: "Malta", code: "mt", url: flag("mt") },
  { name: "Netherlands", code: "nl", url: flag("nl") },
  { name: "Norway", code: "no", url: flag("no") },
  { name: "Slovakia", code: "sk", url: flag("sk") },
  { name: "Slovenia", code: "si", url: flag("si") },
  { name: "Switzerland", code: "ch", url: flag("ch") },
];

export const visaTypes = [
  "Tourist",
  "Business",
  "Student",
  "Work",
  "Transit",
] as const;

// Visa application centres, keyed by the country the applicant is applying from.
// MyVisa serves applicants applying from Turkey, so centres are Turkish cities.
export const visaCenters: Record<string, string[]> = {
  Turkey: [
    "İstanbul",
    "Ankara",
    "İzmir",
    "Antalya",
    "Bursa",
    "Gaziantep",
    "Adana",
    "Konya",
    "Trabzon",
  ],
};

export const purposes = [
  "Tourism / Leisure",
  "Business meeting",
  "Study",
  "Family / Friend visit",
  "Medical treatment",
] as const;

export type Destination = {
  name: string;
  from: string;
  to: string;
  tag: string;
  time: string;
  docs: number;
  fee: string;
};

// Destination guides — the Schengen routes available when applying from Turkey.
// `time` is xvisa's current appointment-wait estimate per route (from xvisa's
// Time Estimator); actual visa processing adds a further ~2–6 weeks. Ordered
// fastest-first, as xvisa lists them. All are Schengen short-stay (Type C), €90.
export const destinations: Destination[] = [
  { name: "Croatia", from: "#0A1F3C", to: "#0d5c4a", tag: "Schengen short-stay visa", time: "~9 days", docs: 6, fee: "€90" },
  { name: "Finland", from: "#0c2647", to: "#12466b", tag: "Schengen short-stay visa", time: "~12 days", docs: 5, fee: "€90" },
  { name: "Slovakia", from: "#0A1F3C", to: "#7a1d2b", tag: "Schengen short-stay visa", time: "~15 days", docs: 5, fee: "€90" },
  { name: "Latvia", from: "#071529", to: "#15406e", tag: "Schengen short-stay visa", time: "~16 days", docs: 5, fee: "€90" },
  { name: "Denmark", from: "#0A1F3C", to: "#0d5c4a", tag: "Schengen short-stay visa", time: "~18 days", docs: 5, fee: "€90" },
  { name: "Lithuania", from: "#0c2647", to: "#6b2440", tag: "Schengen short-stay visa", time: "~20 days", docs: 5, fee: "€90" },
  { name: "Malta", from: "#0A1F3C", to: "#11603f", tag: "Schengen short-stay visa", time: "~22 days", docs: 6, fee: "€90" },
  { name: "Norway", from: "#071529", to: "#134e6b", tag: "Schengen short-stay visa", time: "~25 days", docs: 5, fee: "€90" },
  { name: "Luxembourg", from: "#0A1F3C", to: "#0d5c4a", tag: "Schengen short-stay visa", time: "~26 days", docs: 6, fee: "€90" },
  { name: "Estonia", from: "#0c2647", to: "#12466b", tag: "Schengen short-stay visa", time: "~26 days", docs: 5, fee: "€90" },
  { name: "Slovenia", from: "#0A1F3C", to: "#7a1d2b", tag: "Schengen short-stay visa", time: "~34 days", docs: 5, fee: "€90" },
  { name: "France", from: "#071529", to: "#15406e", tag: "Schengen short-stay visa", time: "~38 days", docs: 6, fee: "€90" },
  { name: "Czech Republic", from: "#0A1F3C", to: "#11603f", tag: "Schengen short-stay visa", time: "~64 days", docs: 6, fee: "€90" },
  { name: "Netherlands", from: "#0c2647", to: "#6b2440", tag: "Schengen short-stay visa", time: "~65 days", docs: 6, fee: "€90" },
  { name: "Bulgaria", from: "#0A1F3C", to: "#0d5c4a", tag: "Schengen short-stay visa", time: "Varies", docs: 6, fee: "€90" },
  { name: "Switzerland", from: "#071529", to: "#134e6b", tag: "Schengen short-stay visa", time: "Varies", docs: 6, fee: "€90" },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Vize süreci ne kadar sürer?",
    a: "Gideceğiniz ülkeye ve vize türüne göre değişir. Çoğu turist vizesi 5 gün ile 4 hafta arasında sürer. Başvurduktan sonra, canlı durum zaman çizelgeniz başvurunuzun tam olarak nerede olduğunu ve her aşamada güncellenmiş bir tahmini gösterir.",
  },
  {
    q: "Hangi belgelere ihtiyacım olacak?",
    a: "Genellikle geçerli bir pasaport, yakın tarihli bir biyometrik fotoğraf, maddi durum belgesi, seyahat planı ve konaklama bilgileri. Bir destinasyon seçtiğinizde MyVisa, yalnızca gerçekten gerekli olanları yüklemeniz için kişiselleştirilmiş bir kontrol listesi oluşturur.",
  },
  {
    q: "Başvurumu gerçek zamanlı takip edebilir miyim?",
    a: "Evet. Her başvurunun bir durum zaman çizelgesi vardır — Başlatıldı, Belgeler bekleniyor, İnceleniyor, Gönderildi, Tamamlandı — ayrıca bir şey değiştiğinde size atanan uzmandan gelen mesaj güncellemeleri.",
  },
  {
    q: "Başvurum reddedilirse ne olur?",
    a: "Belgeler önce doğrulandığında ret nadirdir, ancak yine de olursa belirtilen nedeni sade bir dille açıklar, neyi düzeltmeniz gerektiği konusunda tavsiyede bulunur ve yeniden başvurmanıza yardımcı oluruz. Hizmetimiz bir ücretsiz yeniden gönderim içerir.",
  },
  {
    q: "Kişisel verilerim güvende mi?",
    a: "Tüm belgeler aktarım sırasında ve saklanırken banka düzeyinde güvenlikle şifrelenir. Dosyalar yalnızca ilgili konsolosluk veya büyükelçilikle paylaşılır ve istediğiniz zaman panelinizden kalıcı olarak silebilirsiniz.",
  },
  {
    q: "Vizemin onaylanacağını garanti ediyor musunuz?",
    a: "Hiçbir dürüst hizmet onayı garanti edemez — karar her zaman gideceğiniz ülkenin yetkililerine aittir. Garanti ettiğimiz şey, size mümkün olan en güçlü şansı veren eksiksiz ve hatasız bir başvurudur.",
  },
];

export const statuses = [
  "Started",
  "Documents pending",
  "Under review",
  "Submitted",
  "Completed",
] as const;

export const SERVICE_PLAN_NAME = "Full Service";

// Group-size pricing: the more applicants travel together, the lower the
// per-person fee. Ranges are contiguous (no gaps); the last tier is open-ended.
export type PriceTier = { min: number; max: number; perPerson: number; label: string };
export const PRICE_TIERS: PriceTier[] = [
  { min: 1, max: 4, perPerson: 375, label: "1–4 kişi" },
  { min: 5, max: 9, perPerson: 335, label: "5–9 kişi" },
  { min: 10, max: Infinity, perPerson: 285, label: "10+ kişi" },
];

// Turkish-style euro formatting (e.g. 2010 -> "€2.010").
export const formatEuro = (n: number) => `€${Math.round(n).toLocaleString("tr-TR")}`;

export function tierForPersons(persons: number): PriceTier {
  const p = Math.max(1, Math.floor(persons || 1));
  return PRICE_TIERS.find((t) => p >= t.min && p <= t.max) ?? PRICE_TIERS[PRICE_TIERS.length - 1];
}

// Per-person fee + total for a given group size, with formatted strings.
export function priceForPersons(persons: number) {
  const p = Math.max(1, Math.floor(persons || 1));
  const tier = tierForPersons(p);
  const total = tier.perPerson * p;
  return {
    persons: p,
    perPerson: tier.perPerson,
    total,
    tier,
    perPersonLabel: formatEuro(tier.perPerson),
    totalLabel: formatEuro(total),
  };
}

// Status badge palette (admin table + dialog), keyed by payment status.
export const statusBadge: Record<
  string,
  { bg: string; fg: string; dot: string }
> = {
  Paid: { bg: "#ecfdf5", fg: "#047857", dot: "#10b981" },
  Refunded: { bg: "#fef2f2", fg: "#b91c1c", dot: "#ef4444" },
  Pending: { bg: "#fffbeb", fg: "#b45309", dot: "#f59e0b" },
};

export const flagUrl = flag;
