"use client";
export default function NumberPad({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit?: () => void; }) {
  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];
  function press(k: string) {
    if (k === "⌫") return onChange(value.slice(0, -1));
    const next = value + k;
    onChange(next);
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map(k => (
        <button key={k} className="big-button" onClick={() => press(k)}>{k}</button>
      ))}
      {onSubmit && (
        <button className="big-button col-span-3 bg-accent text-white" onClick={onSubmit}>Submit</button>
      )}
    </div>
  );
}

