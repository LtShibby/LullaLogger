"use client";
import { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import NumberPad from "@/components/NumberPad";
import UnitToggle from "@/components/UnitToggle";
import { useUIStore } from "@/lib/store";
import { ozToMl } from "@/lib/units";
import { appendEvent } from "@/lib/events";

export default function FeedPage({ params }: { params: { babyId: string } }) {
  const uiUnit = useUIStore((s) => s.unit);
  const setUnit = useUIStore((s) => s.setUnit);
  const [qty, setQty] = useState("");
  const [method, setMethod] = useState("bottle");
  const [offered, setOffered] = useState("");
  const [consumed, setConsumed] = useState("");
  const [spit, setSpit] = useState("");
  const [notes, setNotes] = useState("");

  const presets = [30, 60, 90, 120];

  async function save() {
    const unit = uiUnit;
    const base = Number(consumed || qty || 0);
    const consumed_ml = unit === "oz" ? ozToMl(base) : base;
    const offered_ml = offered ? (unit === "oz" ? ozToMl(Number(offered)) : Number(offered)) : undefined;
    const spit_up_ml = spit ? (unit === "oz" ? ozToMl(Number(spit)) : Number(spit)) : undefined;
    await appendEvent({
      baby_id: params.babyId as any,
      type: "feed.single",
      at: new Date().toISOString(),
      meta: {
        consumed: Math.round(consumed_ml),
        offered: offered_ml ? Math.round(offered_ml) : undefined,
        spit_up_ml: spit_up_ml ? Math.round(spit_up_ml) : undefined,
        method,
        unit: uiUnit,
        notes,
      }
    } as any);
    alert("Feed logged.");
    location.href = `/timeline?baby=${params.babyId}`;
  }

  return (
    <main className="container-md">
      <HeaderBar title="Feed" backHref={`/baby/${params.babyId}/new-event`} />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {presets.map(p => (
            <button key={p} className="px-3 py-2 rounded-xl ring-1 ring-border" onClick={() => setQty(String(p))}>{p}</button>
          ))}
        </div>
        <UnitToggle unit={uiUnit} onChange={setUnit} />
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <input className="flex-1 p-3 rounded-xl ring-1 ring-border" placeholder="Quantity" value={qty} onChange={(e) => setQty(e.target.value)} />
          <select className="p-3 rounded-xl ring-1 ring-border" value={method} onChange={(e)=>setMethod(e.target.value)}>
            {['bottle','breast','tube','cup','spoon'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="p-3 rounded-xl ring-1 ring-border" placeholder="Offered" value={offered} onChange={(e)=>setOffered(e.target.value)} />
          <input className="p-3 rounded-xl ring-1 ring-border" placeholder="Consumed" value={consumed} onChange={(e)=>setConsumed(e.target.value)} />
          <input className="p-3 rounded-xl ring-1 ring-border" placeholder="Spit-up" value={spit} onChange={(e)=>setSpit(e.target.value)} />
          <input className="col-span-2 p-3 rounded-xl ring-1 ring-border" placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        </div>
      </div>

      <NumberPad value={qty} onChange={setQty} onSubmit={save} />
      <button className="big-button bg-accent text-white" onClick={save}>Save</button>
    </main>
  );
}

