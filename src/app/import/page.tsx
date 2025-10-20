"use client";
import { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { importCSV, importJSON } from "@/lib/exportImport";

export default function ImportPage({ searchParams }: { searchParams: { baby?: string } }) {
  const babyId = (typeof window !== 'undefined' ? new URLSearchParams(location.search).get('baby') : searchParams.baby) as any;
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"json" | "csv">("json");

  async function run() {
    if (!text.trim()) return;
    let n = 0;
    if (mode === "json") n = await importJSON(text);
    else n = await importCSV(text, babyId);
    alert(`Imported ${n} events`);
  }

  return (
    <main className="container-md">
      <HeaderBar title="Import" backHref={babyId?`/baby/${babyId}`:"/"} />
      <div className="flex gap-2">
        <button className={`big-button ${mode==='json'?'bg-accent text-white':''}`} onClick={()=>setMode('json')}>JSON</button>
        <button className={`big-button ${mode==='csv'?'bg-accent text-white':''}`} onClick={()=>setMode('csv')}>CSV</button>
      </div>
      <textarea className="w-full h-64 p-3 rounded-xl ring-1 ring-border" value={text} onChange={(e)=>setText(e.target.value)} placeholder={mode==='json'?'{"version":1,...}':'id,baby_id,type,...'} />
      <button className="big-button" onClick={run}>Import</button>
    </main>
  );
}

