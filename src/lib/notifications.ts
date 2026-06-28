import { prisma } from "./prisma";
import { hasTelegram, sendTelegram } from "./telegram";

// Durable notification outbox. enqueueTelegram() persists the message and tries
// to deliver immediately; if delivery fails it stays queued and is retried with
// exponential backoff by flushNotifications() (run opportunistically + by cron).

const MAX_ATTEMPTS = 8;
const STALE_SENDING_MS = 5 * 60_000; // reclaim rows stuck "sending" after a crash

// Backoff per attempt: 1, 2, 4, 8, 16, 32, 60, 60… minutes.
function backoffMs(attempts: number): number {
  return Math.min(60, 2 ** Math.max(0, attempts - 1)) * 60_000;
}

async function deliver(id: string, payload: string, attempts: number): Promise<void> {
  // Atomically claim the row so concurrent drainers can't double-send it.
  const claim = await prisma.notification.updateMany({
    where: { id, status: "pending" },
    data: { status: "sending" },
  });
  if (claim.count !== 1) return;

  const ok = await sendTelegram(payload);
  const next = attempts + 1;

  if (ok) {
    await prisma.notification.update({
      where: { id },
      data: { status: "sent", sentAt: new Date(), attempts: next, lastError: null },
    });
  } else {
    await prisma.notification.update({
      where: { id },
      data: {
        status: next >= MAX_ATTEMPTS ? "failed" : "pending",
        attempts: next,
        nextAttempt: new Date(Date.now() + backoffMs(next)),
        lastError: `delivery failed (attempt ${next})`,
      },
    });
  }
}

export async function enqueueTelegram(payload: string): Promise<void> {
  // Not configured → don't queue (nothing could ever deliver it).
  if (!hasTelegram()) {
    console.log(`[telegram skipped — not configured]\n${payload}`);
    return;
  }
  let id: string;
  try {
    const row = await prisma.notification.create({ data: { channel: "telegram", payload } });
    id = row.id;
  } catch (e) {
    console.error("[notifications] enqueue failed:", e);
    return;
  }
  // Best-effort immediate delivery; on failure it remains queued for retry.
  await deliver(id, payload, 0);
}

// Process due pending notifications. Safe to call from anywhere (opportunistic
// flush on writes, or a scheduled cron). Returns how many it attempted.
export async function flushNotifications(limit = 25): Promise<number> {
  // Reclaim rows stuck in "sending" from a crashed previous run.
  await prisma.notification.updateMany({
    where: { status: "sending", updatedAt: { lt: new Date(Date.now() - STALE_SENDING_MS) } },
    data: { status: "pending" },
  });

  const due = await prisma.notification.findMany({
    where: { status: "pending", nextAttempt: { lte: new Date() } },
    orderBy: { nextAttempt: "asc" },
    take: limit,
  });

  for (const n of due) {
    await deliver(n.id, n.payload, n.attempts);
  }
  return due.length;
}
