import { listEvents } from "@/lib/events";
import { todayRange } from "@/lib/time";
import type { BaseEvent, ULID } from "@/lib/types";

export async function eventsForToday(babyId: ULID): Promise<BaseEvent[]> {
  const { start } = todayRange();
  return listEvents({ babyId, since: start.toISOString() });
}

export async function lastOpenSleep(babyId: ULID): Promise<BaseEvent | undefined> {
  const events = await listEvents({ babyId });
  let lastStart: BaseEvent | undefined;
  for (const e of events) {
    if (e.deleted) continue;
    if (e.type === "sleep.start") lastStart = e;
    if (e.type === "sleep.end") lastStart = undefined;
  }
  return lastStart;
}

