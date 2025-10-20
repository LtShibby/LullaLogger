"use client";
import { useState } from "react";
import { createBaby } from "@/lib/babies";
import type { Gender } from "@/lib/types";

export default function AddBabyModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("neutral");
  const [error, setError] = useState<string | undefined>();

  async function save() {
    if (!name.trim()) { setError("Name required"); return; }
    await createBaby(name.trim(), gender);
    setOpen(false);
    setName("");
    onCreated?.();
  }

  return (
    <div>
      <button className="big-button" onClick={() => setOpen(true)}>Add Baby</button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4">
          <div className="card w-full max-w-md p-4 space-y-4">
            <div className="text-lg font-semibold">Add Baby</div>
            <input className="w-full p-3 rounded-xl ring-1 ring-border" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex gap-2">
              {(["neutral","male","female"] as Gender[]).map(g => (
                <label key={g} className={`flex-1 text-center p-3 rounded-xl ring-1 ${gender===g?"bg-accentSoft ring-accent":"ring-border"}`}>
                  <input type="radio" name="gender" className="hidden" checked={gender===g} onChange={() => setGender(g)} />
                  {g}
                </label>
              ))}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2">
              <button className="big-button" onClick={() => setOpen(false)}>Cancel</button>
              <button className="big-button bg-accent text-white" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

