import { dbSet, dbGet, dbList } from "@/lib/db";
import type { BaseEvent, DaySummary, FeedMethod, ULID } from "@/lib/types";
import { generateId } from "@/lib/id";
import { parseIso } from "@/lib/time";
import { format } from "date-fns";

const SUM_KEY = "summary:"; // summary:<babyId>:<yyyy-mm-dd>

function dayKey(babyId: ULID, d: Date): string {
  return `${SUM_KEY}${babyId}:${format(d, "yyyy-MM-dd")}`;
}

export async function recomputeForDay(babyId: ULID, day: Date, events: BaseEvent[]): Promise<DaySummary> {
  const dayStr = format(day, "yyyy-MM-dd");
  const id = generateId();
  let total_sleep_ms = 0;
  let total_feed_ml = 0;
  let total_offered_ml = 0;
  let net_intake_ml = 0;
  const sleeps: Array<{ start: string; end: string; dur_ms: number; }> = [];
  const feeds: Array<{ at: string; method?: FeedMethod; consumed_ml?: number; offered_ml?: number; spit_up_ml?: number; unit?: any; duration_ms?: number; breast_side?: any; notes?: string; }> = [];

  // Pair sleep.start/end by time order for the day
  const dayEvents = events.filter(e => !e.deleted && e.at.startsWith(dayStr));
  let lastSleepStart: BaseEvent | undefined;
  for (const e of dayEvents) {
    if (e.type === "sleep.start") {
      lastSleepStart = e;
    } else if (e.type === "sleep.end" && lastSleepStart) {
      const dur = Math.max(0, new Date(e.at).getTime() - new Date(lastSleepStart.at).getTime());
      if (dur >= 5 * 60 * 1000) { // exclude micro sleeps <5m
        total_sleep_ms += dur;
        sleeps.push({ start: lastSleepStart.at, end: e.at, dur_ms: dur });
      }
      lastSleepStart = undefined;
    }
    if (e.type === "feed.single") {
      const consumed_ml = e.meta && (e.meta as any).consumed ? Number((e.meta as any).consumed) : 0;
      const offered_ml = e.meta && (e.meta as any).offered ? Number((e.meta as any).offered) : 0;
      const spit_up_ml = e.meta && (e.meta as any).spit_up_ml ? Number((e.meta as any).spit_up_ml) : 0;
      total_feed_ml += consumed_ml;
      total_offered_ml += offered_ml;
      net_intake_ml += Math.max(0, consumed_ml - spit_up_ml);
      feeds.push({
        at: e.at,
        method: (e.meta as any)?.method,
        consumed_ml,
        offered_ml,
        spit_up_ml,
        unit: (e.meta as any)?.unit,
        duration_ms: (e.meta as any)?.duration_ms,
        breast_side: (e.meta as any)?.breast_side,
        notes: (e.meta as any)?.notes,
      });
    }
  }

  const summary: DaySummary = {
    id,
    baby_id: babyId,
    date: dayStr,
    total_sleep_ms,
    total_feed_ml,
    total_offered_ml,
    net_intake_ml,
    sessions: { sleeps, feeds },
  };
  await dbSet(dayKey(babyId, day), summary);
  return summary;
}

export async function getSummary(babyId: ULID, date: string): Promise<DaySummary | undefined> {
  return dbGet<DaySummary>(`${SUM_KEY}${babyId}:${date}`);
}

export async function recomputeAllForBaby(babyId: ULID, events: BaseEvent[]): Promise<void> {
  const byDay = new Map<string, BaseEvent[]>();
  for (const e of events) {
    const d = e.at.slice(0, 10);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(e);
  }
  for (const [d, es] of byDay.entries()) {
    const date = new Date(d + "T00:00:00Z");
    await recomputeForDay(babyId, date, es);
  }
}

