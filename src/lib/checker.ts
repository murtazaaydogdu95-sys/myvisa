import { destinations } from "./data";

export type CheckerInput = {
  nationality: string;
  destination: string;
  visaType: string;
  visaCenter?: string;
};

export type CheckerResult = {
  visa: string;
  dest: string;
  time: string;
  fee: string;
  docs: number;
  nationality: string;
};

// Ported from runChecker() in MyVisa.dc.html — matches a destination by the
// first word of its name and derives the snapshot from the destinations table.
export function runChecker(c: CheckerInput): CheckerResult | null {
  if (!c.nationality || !c.destination) return null;
  const t = c.visaType || "Tourist";
  const d =
    destinations.find((x) => c.destination.indexOf(x.name.split(" ")[0]) > -1) ||
    destinations[0];
  return {
    visa: `${t} visa`,
    dest: c.destination,
    time: d.time,
    fee: d.fee,
    docs: d.docs,
    nationality: c.nationality,
  };
}
