"use client";
import { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { exportJSON, exportCSV } from "@/lib/exportImport";

export default function ExportPage({ searchParams }: { searchParams: { baby?: string } }) {
  const babyId = (typeof window !== 'undefined' ? new URLSearchParams(location.search).get('baby') : searchParams.baby) as any;
  const [jsonData, setJsonData] = useState<string>("");
  const [csvData, setCsvData] = useState<string>("");

  async function doJSON() {
    if (!babyId) return;
    setJsonData(await exportJSON(babyId));
  }
  async function doCSV() {
    if (!babyId) return;
    setCsvData(await exportCSV(babyId));
  }

  return (
    <main className="container-md">
      <HeaderBar title="Export" backHref={babyId?`/baby/${babyId}`:"/"} />
      <div className="flex gap-2">
        <button className="big-button" onClick={doJSON}>Export JSON</button>
        <button className="big-button" onClick={doCSV}>Export CSV</button>
      </div>
      {jsonData && <textarea className="w-full h-40 p-3 rounded-xl ring-1 ring-border" value={jsonData} readOnly />}
      {csvData && <textarea className="w-full h-40 p-3 rounded-xl ring-1 ring-border" value={csvData} readOnly />}
    </main>
  );
}

