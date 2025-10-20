"use client";
import { useEffect, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { appendEvent, listEvents } from "@/lib/events";
import { lastOpenSleep } from "@/lib/selectors";

export default function SleepPage({ params }: { params: { babyId: string } }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [openStartId, setOpenStartId] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const s = await lastOpenSleep(params.babyId as any);
      setOpenStartId(s?.id);
    })();
  }, [params.babyId]);

  async function startNow() {
    await appendEvent({ baby_id: params.babyId as any, type: "sleep.start", at: new Date().toISOString() } as any);
    alert("Sleep started.");
  }
  async function endNow() {
    if (!openStartId) return;
    const events = await listEvents({ babyId: params.babyId as any });
    const startEvt = events.find(e => e.id === openStartId)!;
    const now = new Date().toISOString();
    const dur = new Date(now).getTime() - new Date(startEvt.at).getTime();
    await appendEvent({ baby_id: params.babyId as any, type: "sleep.end", at: now, dur_ms: dur } as any);
    alert("Sleep ended.");
  }
  async function logPast() {
    if (!start || !end) return;
    const dur = new Date(end).getTime() - new Date(start).getTime();
    if (dur <= 0) { alert("End must be after start"); return; }
    await appendEvent({ baby_id: params.babyId as any, type: "sleep.start", at: new Date(start).toISOString() } as any);
    await appendEvent({ baby_id: params.babyId as any, type: "sleep.end", at: new Date(end).toISOString(), dur_ms: dur } as any);
    alert("Sleep logged.");
  }

  return (
    <main className="container-md">
      <HeaderBar title="Sleep" backHref={`/baby/${params.babyId}/new-event`} />
      <div className="space-y-3">
        <button className="big-button bg-accent text-white" onClick={startNow}>Start Sleep Now</button>
        {openStartId && (
          <div className="card p-3 text-sm">End Sleep from Dashboard later — or
            <button className="ml-2 underline" onClick={endNow}>End Sleep Now</button>
          </div>
        )}
        <div className="card p-4 space-y-3">
          <div className="font-semibold">Log Past Sleep</div>
          <input className="w-full p-3 rounded-xl ring-1 ring-border" type="datetime-local" value={start} onChange={(e)=>setStart(e.target.value)} />
          <input className="w-full p-3 rounded-xl ring-1 ring-border" type="datetime-local" value={end} onChange={(e)=>setEnd(e.target.value)} />
          <button className="big-button" onClick={logPast}>Save</button>
        </div>
      </div>
    </main>
  );
}

