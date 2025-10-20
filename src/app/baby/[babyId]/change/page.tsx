"use client";
import { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { appendEvent } from "@/lib/events";

export default function ChangePage({ params }: { params: { babyId: string } }) {
  const [kind, setKind] = useState<string | undefined>();
  const [notes, setNotes] = useState("");

  async function save() {
    if (!kind) return;
    await appendEvent({
      baby_id: params.babyId as any,
      type: "diaper",
      at: new Date().toISOString(),
      meta: { kind, notes }
    } as any);
    alert("Change logged.");
    location.href = `/timeline?baby=${params.babyId}`;
  }

  return (
    <main className="container-md">
      <HeaderBar title="Change" backHref={`/baby/${params.babyId}/new-event`} />
      <div className="grid grid-cols-3 gap-2">
        {['wet','dirty','mixed'].map(k => (
          <button key={k} className={`big-button ${kind===k?"bg-accent text-white":""}`} onClick={()=>setKind(k)}>{k}</button>
        ))}
      </div>
      <input className="w-full p-3 rounded-xl ring-1 ring-border" placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
      <button className="big-button bg-accent text-white" onClick={save}>Save</button>
    </main>
  );
}

