import { dbGet, dbSet, dbList, dbUpdate } from "@/lib/db";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/time";
import type { BaseEvent, ULID } from "@/lib/types";

const EVENTS_KEY = "events:"; // events:<id>
const CLIENT_REV_KEY = "client-rev"; // single counter per device

async function nextClientRev(): Promise<number> {
  const current = (await dbGet<number>(CLIENT_REV_KEY)) ?? 0;
  const next = current + 1;
  await dbSet(CLIENT_REV_KEY, next);
  return next;
}

export async function appendEvent(e: Omit<BaseEvent, "id" | "created_at" | "client_rev"> & { id?: ULID }): Promise<BaseEvent> {
  const id = e.id ?? generateId();
  const full: BaseEvent = {
    ...e,
    id,
    created_at: nowIso(),
    client_rev: await nextClientRev(),
  };
  await dbSet(EVENTS_KEY + id, full);
  return full;
}

export async function listEvents(params: { babyId: ULID; since?: string }): Promise<BaseEvent[]> {
  const rows = await dbList(EVENTS_KEY);
  const filtered = rows
    .map((r) => r.value as BaseEvent)
    .filter((e) => e.baby_id === params.babyId && (!params.since || e.at >= params.since));
  return filtered.sort((a, b) => a.at.localeCompare(b.at));
}

export async function tombstone(id: ULID): Promise<void> {
  await dbUpdate<BaseEvent | undefined>(EVENTS_KEY + id, (prev) => {
    if (!prev) return prev as any;
    return { ...prev, deleted: true };
  });
}

export async function replaceEvent(oldId: ULID, newEvent: Omit<BaseEvent, "id" | "created_at" | "client_rev">): Promise<BaseEvent> {
  await tombstone(oldId);
  return appendEvent(newEvent);
}

