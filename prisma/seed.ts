import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Admin "customers" — everyone who has paid (isDemo=false → shown on /admin).
// Ported verbatim from the `customers` array in MyVisa.dc.html.
const customers = [
  { ref: "MV-48213", fullName: "Maria Santos Cruz", email: "maria.cruz@email.com", nationalityFlag: "ph", nationality: "Philippines", destination: "United States", destinationFlag: "us", visaType: "B-2 Tourist", plan: "Standard", amount: "$89.00", govFee: "$185.00", status: "Paid", paidOn: "18 Jun 2026", txn: "txn_9f2a71c4", paymentMethod: "Visa •••• 4242", phone: "+63 917 555 0142", passport: "P4521889", travelDate: "14 Aug 2026", duration: "21 days" },
  { ref: "MV-48180", fullName: "David Okonkwo", email: "d.okonkwo@email.com", nationalityFlag: "ng", nationality: "Nigeria", destination: "United Kingdom", destinationFlag: "gb", visaType: "Standard Visitor", plan: "Premium", amount: "$199.00", govFee: "£115.00", status: "Paid", paidOn: "17 Jun 2026", txn: "txn_3b8e09da", paymentMethod: "Mastercard •••• 8810", phone: "+234 803 555 0199", passport: "A09812234", travelDate: "02 Sep 2026", duration: "14 days" },
  { ref: "MV-48155", fullName: "Priya Sharma", email: "priya.sharma@email.com", nationalityFlag: "in", nationality: "India", destination: "Schengen Area (Europe)", destinationFlag: "eu", visaType: "Schengen Tourist", plan: "Standard", amount: "$89.00", govFee: "€90.00", status: "Paid", paidOn: "17 Jun 2026", txn: "txn_7c1d44fb", paymentMethod: "Visa •••• 1191", phone: "+91 98200 55501", passport: "Z3398210", travelDate: "10 Jul 2026", duration: "18 days" },
  { ref: "MV-48090", fullName: "Ahmed Al-Rashid", email: "ahmed.r@email.com", nationalityFlag: "ae", nationality: "United Arab Emirates", destination: "Canada", destinationFlag: "ca", visaType: "Visitor Visa", plan: "Basic", amount: "$29.00", govFee: "CA$100.00", status: "Refunded", paidOn: "15 Jun 2026", txn: "txn_1a9f63ee", paymentMethod: "Amex •••• 0027", phone: "+971 50 555 0188", passport: "UAE778201", travelDate: "25 Aug 2026", duration: "10 days" },
  { ref: "MV-48041", fullName: "Sofia Müller", email: "sofia.muller@email.com", nationalityFlag: "de", nationality: "Germany", destination: "Australia", destinationFlag: "au", visaType: "eVisitor 651", plan: "Standard", amount: "$89.00", govFee: "AU$190.00", status: "Paid", paidOn: "14 Jun 2026", txn: "txn_5e2b88a1", paymentMethod: "Visa •••• 7733", phone: "+49 151 555 0123", passport: "C01992847", travelDate: "19 Sep 2026", duration: "28 days" },
  { ref: "MV-47988", fullName: "James Mwangi", email: "j.mwangi@email.com", nationalityFlag: "ke", nationality: "Kenya", destination: "United Arab Emirates", destinationFlag: "ae", visaType: "30-Day Tourist", plan: "Basic", amount: "$29.00", govFee: "$90.00", status: "Paid", paidOn: "13 Jun 2026", txn: "txn_8d4c12bf", paymentMethod: "Mastercard •••• 5567", phone: "+254 712 555 0177", passport: "K8820194", travelDate: "05 Jul 2026", duration: "12 days" },
  { ref: "MV-47902", fullName: "Liu Wei", email: "liu.wei@email.com", nationalityFlag: "jp", nationality: "Japan", destination: "United States", destinationFlag: "us", visaType: "B-1 Business", plan: "Premium", amount: "$199.00", govFee: "$185.00", status: "Paid", paidOn: "12 Jun 2026", txn: "txn_2f7a90cd", paymentMethod: "Visa •••• 3398", phone: "+81 90 5550 0144", passport: "TR9982017", travelDate: "30 Jul 2026", duration: "9 days" },
  { ref: "MV-47855", fullName: "Isabella Rossi", email: "i.rossi@email.com", nationalityFlag: "br", nationality: "Brazil", destination: "United Kingdom", destinationFlag: "gb", visaType: "Standard Visitor", plan: "Standard", amount: "$89.00", govFee: "£115.00", status: "Pending", paidOn: "11 Jun 2026", txn: "txn_6b3e21aa", paymentMethod: "Visa •••• 9921", phone: "+55 11 95555 0166", passport: "BR5512098", travelDate: "22 Aug 2026", duration: "16 days" },
];

// ── Dashboard demo user's applications (isDemo=true → shown on /dashboard).
// Ported from the `dashApps` array. statusIndex maps onto the statuses[] timeline.
const dashApps = [
  {
    ref: "MV-48213-D", title: "Schengen Turist Vizesi", destination: "France (Schengen)", destinationFlag: "eu", visaType: "Tourist",
    paidOn: "12 Haz 2026", statusIndex: 2, plan: "Standard", amount: "$89.00",
    docs: [
      { name: "Pasaport.pdf", state: "Verified" },
      { name: "Fotoğraf.jpg", state: "Verified" },
      { name: "Banka ekstresi.pdf", state: "In review" },
      { name: "Seyahat planı.pdf", state: "Verified" },
    ],
    messages: [
      { who: "Amelia · MyVisa uzmanı", when: "2 saat önce", text: "Banka ekstreniz inceleniyor. Diğer her şey harika görünüyor — şu an sizden bir işlem beklenmiyor." },
      { who: "Sistem", when: "1 gün önce", text: "Başvuru \"İnceleniyor\" durumuna geçti." },
    ],
  },
  {
    ref: "MV-48180-D", title: "ABD B-2 Ziyaretçi Vizesi", destination: "United States", destinationFlag: "us", visaType: "Tourist",
    paidOn: "08 Haz 2026", statusIndex: 1, plan: "Premium", amount: "$199.00",
    docs: [
      { name: "Pasaport.pdf", state: "Verified" },
      { name: "Fotoğraf.jpg", state: "Action needed" },
      { name: "DS-160 onayı.pdf", state: "Missing" },
    ],
    messages: [
      { who: "Daniel · MyVisa uzmanı", when: "5 saat önce", text: "Fotoğrafınız 5x5 cm gereksinimini karşılamıyor — lütfen yeniden yükleyin. Tam ölçüyü kontrol listenizde işaretledim." },
    ],
  },
  {
    ref: "MV-47902-D", title: "Kanada eTA", destination: "Canada", destinationFlag: "ca", visaType: "eTA",
    paidOn: "21 May 2026", statusIndex: 4, plan: "Basic", amount: "$29.00",
    docs: [{ name: "Pasaport.pdf", state: "Verified" }],
    messages: [
      { who: "Sistem", when: "24 May", text: "eTA'nız onaylandı ve pasaportunuza bağlandı. İyi yolculuklar!" },
    ],
  },
];

async function main() {
  // Idempotent reseed: clear app data (children cascade) + contact messages.
  await prisma.message.deleteMany();
  await prisma.document.deleteMany();
  await prisma.application.deleteMany();
  await prisma.contactMessage.deleteMany();

  // Normalize the MyVisa service fee to the current single plan (€375), keeping
  // each customer's real per-country government fee.
  for (const c of customers) {
    await prisma.application.create({
      data: { ...c, amount: "€375.00", plan: "Full Service", statusIndex: 4, isDemo: false },
    });
  }

  const demoUser = { fullName: "Jordan Blake", email: "jordan.blake@email.com", nationality: "United Kingdom", nationalityFlag: "gb" };
  for (const a of dashApps) {
    await prisma.application.create({
      data: {
        ref: a.ref,
        title: a.title,
        ...demoUser,
        destination: a.destination,
        destinationFlag: a.destinationFlag,
        visaType: a.visaType,
        plan: "Full Service",
        amount: "€375.00",
        paidOn: a.paidOn,
        status: "Paid",
        statusIndex: a.statusIndex,
        isDemo: true,
        documents: { create: a.docs },
        messages: { create: a.messages },
      },
    });
  }

  const total = await prisma.application.count();
  console.log(`Seeded ${customers.length} customers + ${dashApps.length} demo applications (${total} total).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
