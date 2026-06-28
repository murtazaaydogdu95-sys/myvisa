import { NextResponse } from "next/server";
import { flushNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

// Scheduled drainer for the notification outbox. Protected by CRON_SECRET so
// only the in-cluster CronJob (or an authorized caller) can trigger it.
// Call with header `x-cron-secret: <secret>` or `?secret=<secret>`.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "cron disabled (no CRON_SECRET)" }, { status: 503 });
  }
  const provided =
    req.headers.get("x-cron-secret") ?? new URL(req.url).searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const processed = await flushNotifications(50);
    return NextResponse.json({ processed });
  } catch (e) {
    console.error("[cron] flush-notifications failed:", e);
    return NextResponse.json({ error: "flush failed" }, { status: 500 });
  }
}
