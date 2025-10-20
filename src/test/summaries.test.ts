import { describe, it, expect } from "vitest";
import { recomputeForDay } from "@/lib/summaries";
import type { BaseEvent, ULID } from "@/lib/types";
import { formatISO } from "date-fns";

function evt(partial: Partial<BaseEvent>): BaseEvent {
  return {
    id: partial.id as ULID || "A",
    baby_id: partial.baby_id as ULID || "B",
    type: partial.type as any,
    at: partial.at || new Date().toISOString(),
    dur_ms: partial.dur_ms,
    meta: partial.meta,
    created_at: partial.created_at || new Date().toISOString(),
    client_rev: partial.client_rev || 1,
    deleted: partial.deleted,
  };
}

describe("summaries", () => {
  it("computes net intake (consumed - spit_up)", async () => {
    const day = new Date();
    const dstr = day.toISOString().slice(0,10);
    const events = [
      evt({ type: "feed.single", at: `${dstr}T08:00:00.000Z`, meta: { consumed: 100, spit_up_ml: 20 } }),
      evt({ type: "feed.single", at: `${dstr}T10:00:00.000Z`, meta: { consumed: 80 } }),
    ];
    const sum = await recomputeForDay("B" as ULID, new Date(`${dstr}T00:00:00Z`), events);
    expect(sum.total_feed_ml).toBe(180);
    expect(sum.net_intake_ml).toBe(160);
  });

  it("excludes micro sleeps <5m from totals", async () => {
    const day = new Date();
    const dstr = day.toISOString().slice(0,10);
    const events = [
      evt({ type: "sleep.start", at: `${dstr}T08:00:00.000Z` }),
      evt({ type: "sleep.end", at: `${dstr}T08:04:00.000Z`, dur_ms: 4*60*1000 }),
      evt({ type: "sleep.start", at: `${dstr}T09:00:00.000Z` }),
      evt({ type: "sleep.end", at: `${dstr}T09:10:00.000Z`, dur_ms: 10*60*1000 }),
    ];
    const sum = await recomputeForDay("B" as ULID, new Date(`${dstr}T00:00:00Z`), events);
    expect(sum.total_sleep_ms).toBe(10*60*1000);
  });

  it("past sleep pair logging computes duration", async () => {
    const day = new Date();
    const dstr = day.toISOString().slice(0,10);
    const events = [
      evt({ type: "sleep.start", at: `${dstr}T01:00:00.000Z` }),
      evt({ type: "sleep.end", at: `${dstr}T03:30:00.000Z`, dur_ms: 150*60*1000 }),
    ];
    const sum = await recomputeForDay("B" as ULID, new Date(`${dstr}T00:00:00Z`), events);
    expect(sum.total_sleep_ms).toBe(150*60*1000);
  });
});

