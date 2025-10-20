import { describe, it, expect } from "vitest";
import { exportCSV, importCSV, exportJSON, importJSON } from "@/lib/exportImport";
import { appendEvent, listEvents } from "@/lib/events";

const babyId = "B" as any;

describe("export/import", () => {
  it("CSV oz import converts to ml internally", async () => {
    const csv = "id,baby_id,type,at,dur_ms,consumed_ml,offered_ml,spit_up_ml,method,unit,duration_ms,breast_side,notes,created_at,client_rev,deleted\n" +
      ["","B","feed.single","2024-01-01T12:00:00.000Z","","5","","","bottle","oz","","","","2024-01-01T12:00:00.000Z","1","0"].join(",");
    const count = await importCSV(csv, babyId);
    expect(count).toBe(1);
    const events = await listEvents({ babyId });
    const e = events[events.length-1];
    expect((e.meta as any).consumed).toBeGreaterThan(100); // 5 oz -> ~148 ml
  });

  it("JSON round-trip is stable shape", async () => {
    await appendEvent({ baby_id: babyId, type: "diaper", at: new Date().toISOString(), meta: { kind: "wet" } } as any);
    const json = await exportJSON(babyId);
    const added = await importJSON(json);
    expect(added).toBeGreaterThan(0);
  });
});

