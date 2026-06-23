// Small shared formatting helpers.

export function initials(name: string): string {
  return name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
}

// Generate a MyVisa reference like "MV-48213".
export function makeRef(): string {
  return `MV-${Math.floor(40000 + Math.random() * 9999)}`;
}

// Generate a mock transaction id like "txn_9f2a71c4".
export function makeTxn(): string {
  return `txn_${Math.random().toString(16).slice(2, 10)}`;
}

// "18 Haz 2026"
export function formatDay(d: Date = new Date()): string {
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Sum "€375.00"-style amount strings into a "€X.XX" total (currency-agnostic;
// uses the symbol of the first amount, defaulting to €).
export function sumAmounts(amounts: string[]): string {
  const symbol = amounts[0]?.match(/^[^\d.,\s]+/)?.[0] ?? "€";
  const total = amounts.reduce(
    (sum, a) => sum + (parseFloat(a.replace(/[^\d.]/g, "")) || 0),
    0,
  );
  return symbol + total.toFixed(2);
}
