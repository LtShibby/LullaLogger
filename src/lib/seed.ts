import { listBabies, createBaby } from "@/lib/babies";
import { appendEvent } from "@/lib/events";
import { formatISO, subHours, addMinutes } from "date-fns";

export async function ensureDevSeed() {
  if (process.env.NODE_ENV !== "development") return;
  const babies = await listBabies();
  if (babies.length > 0) return;
  const b = await createBaby("Kaladin", "male");

  const now = new Date();
  const start = subHours(now, 8);
  // a few feeds
  for (const mins of [30, 180, 330]) {
    const at = addMinutes(start, mins);
    await appendEvent({
      id: undefined,
      baby_id: b.id,
      type: "feed.single",
      at: formatISO(at),
      meta: { consumed: 90, offered: 120, unit: "ml", method: "bottle" },
    } as any);
  }
  // a sleep session
  const s1 = addMinutes(start, 60);
  const e1 = addMinutes(s1, 120);
  await appendEvent({ baby_id: b.id, type: "sleep.start", at: formatISO(s1) } as any);
  await appendEvent({ baby_id: b.id, type: "sleep.end", at: formatISO(e1), dur_ms: 120*60*1000 } as any);
}

