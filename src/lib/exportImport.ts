import type { BaseEvent, ULID } from "@/lib/types";
import { listEvents, appendEvent } from "@/lib/events";
import { ozToMl } from "@/lib/units";

export async function exportJSON(babyId: ULID): Promise<string> {
  const events = await listEvents({ babyId });
  return JSON.stringify({ version: 1, babyId, events }, null, 2);
}

export async function exportCSV(babyId: ULID): Promise<string> {
  const events = await listEvents({ babyId });
  const header = [
    "id","baby_id","type","at","dur_ms","consumed_ml","offered_ml","spit_up_ml","method","unit","duration_ms","breast_side","notes","created_at","client_rev","deleted"
  ];
  const rows = events.map(e => {
    const m: any = e.meta || {};
    return [
      e.id, e.baby_id, e.type, e.at, e.dur_ms ?? "",
      m.consumed ?? "", m.offered ?? "", m.spit_up_ml ?? "",
      m.method ?? "", m.unit ?? "", m.duration_ms ?? "", m.breast_side ?? "",
      (m.notes ?? "").replace(/\n/g, " "), e.created_at, e.client_rev, e.deleted ? 1 : 0
    ].map(String).map((s) => s.includes(",") ? `"${s.replace(/"/g, '""')}"` : s).join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

export async function importJSON(json: string): Promise<number> {
  const data = JSON.parse(json);
  if (!data || !Array.isArray(data.events)) return 0;
  let count = 0;
  for (const e of data.events as BaseEvent[]) {
    await appendEvent(e as any);
    count++;
  }
  return count;
}

export async function importCSV(csv: string, babyIdFallback?: ULID): Promise<number> {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length <= 1) return 0;
  const header = lines[0].split(",");
  const idx = (name: string) => header.indexOf(name);
  const consumedIdx = idx("consumed_ml");
  const unitIdx = idx("unit");
  let count = 0;
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const meta: any = {};
    const consumed = cells[consumedIdx];
    const unit = cells[unitIdx];
    if (consumed) {
      meta.consumed = unit === "oz" ? ozToMl(Number(consumed)) : Number(consumed);
    }
    const event: Partial<BaseEvent> = {
      id: cells[idx("id")] || undefined,
      baby_id: (cells[idx("baby_id")] || babyIdFallback) as ULID,
      type: cells[idx("type")] as any,
      at: cells[idx("at")],
      dur_ms: cells[idx("dur_ms")] ? Number(cells[idx("dur_ms")]) : undefined,
      meta,
      created_at: cells[idx("created_at")] || new Date().toISOString(),
      client_rev: Number(cells[idx("client_rev")] || 0),
      deleted: cells[idx("deleted")] === "1",
    };
    await appendEvent(event as any);
    count++;
  }
  return count;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; continue; }
      if (ch === '"') { inQ = false; continue; }
      cur += ch;
    } else {
      if (ch === ',') { out.push(cur); cur = ""; continue; }
      if (ch === '"') { inQ = true; continue; }
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

