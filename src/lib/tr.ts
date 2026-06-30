// Turkish display maps. The app stores canonical English values in the DB and
// uses them as logic keys (status, document state, timeline, plan, visa type,
// country names); these maps translate them for display only.

export const countryTR: Record<string, string> = {
  Turkey: "Türkiye",
  // Turkey destination routes
  Croatia: "Hırvatistan",
  Finland: "Finlandiya",
  Slovakia: "Slovakya",
  Latvia: "Letonya",
  Denmark: "Danimarka",
  Lithuania: "Litvanya",
  Malta: "Malta",
  Norway: "Norveç",
  Luxembourg: "Lüksemburg",
  Estonia: "Estonya",
  Slovenia: "Slovenya",
  France: "Fransa",
  "Czech Republic": "Çekya",
  Netherlands: "Hollanda",
  Bulgaria: "Bulgaristan",
  Switzerland: "İsviçre",
  // nationalities / other displayed countries
  "United Kingdom": "Birleşik Krallık",
  "United States": "Amerika Birleşik Devletleri",
  India: "Hindistan",
  Nigeria: "Nijerya",
  Germany: "Almanya",
  Canada: "Kanada",
  Australia: "Avustralya",
  Brazil: "Brezilya",
  Philippines: "Filipinler",
  "South Africa": "Güney Afrika",
  "United Arab Emirates": "Birleşik Arap Emirlikleri",
  Japan: "Japonya",
  Pakistan: "Pakistan",
  Kenya: "Kenya",
  "Schengen Area (Europe)": "Schengen Bölgesi (Avrupa)",
  "France (Schengen)": "Fransa (Schengen)",
};

export const trCountry = (name: string) => countryTR[name] ?? name;

export const visaTypeTR: Record<string, string> = {
  Tourist: "Turist",
  Business: "İş",
  Student: "Öğrenci",
  Work: "Çalışma",
  Transit: "Transit",
};

export const purposeTR: Record<string, string> = {
  "Tourism / Leisure": "Turizm / Tatil",
  "Business meeting": "İş görüşmesi",
  Study: "Eğitim",
  "Family / Friend visit": "Aile / Arkadaş ziyareti",
  "Medical treatment": "Tıbbi tedavi",
};

export const statusTR: Record<string, string> = {
  Paid: "Tamamı ödendi",
  DepositPaid: "Kapora ödendi",
  Refunded: "İade edildi",
  Pending: "Beklemede",
};

export const docStateTR: Record<string, string> = {
  Verified: "Onaylandı",
  "In review": "İncelemede",
  "Action needed": "İşlem gerekli",
  Missing: "Eksik",
};

export const statusesTR: Record<string, string> = {
  Started: "Başlatıldı",
  "Documents pending": "Belgeler bekleniyor",
  "Under review": "İnceleniyor",
  Submitted: "Gönderildi",
  Completed: "Tamamlandı",
};

export const planTR: Record<string, string> = {
  "Full Service": "Tam Hizmet",
  Basic: "Temel",
  Standard: "Standart",
  Premium: "Premium",
};

// Translate the time tokens used in destination guides ("~9 days", "Varies").
export function trTime(time: string): string {
  if (time === "Varies") return "Değişken";
  return time.replace(/days?/i, "gün");
}

export const tagTR: Record<string, string> = {
  "Schengen short-stay visa": "Schengen kısa süreli vize",
};
export const trTag = (tag: string) => tagTR[tag] ?? tag;

