"use client";
export default function UnitToggle({ unit, onChange }: { unit: "ml" | "oz"; onChange: (u: "ml" | "oz") => void; }) {
  return (
    <div className="inline-flex rounded-xl ring-1 ring-border overflow-hidden">
      {(["ml","oz"] as const).map((u) => (
        <button key={u} className={`px-3 py-2 ${unit===u?"bg-accent text-white":"bg-card"}`} onClick={() => onChange(u)}>
          {u}
        </button>
      ))}
    </div>
  );
}

