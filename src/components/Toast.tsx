"use client";
import { useEffect, useState } from "react";

type ToastMsg = { id: number; text: string };
let counter = 1;

export function toast(text: string) {
  window.dispatchEvent(new CustomEvent("ll:toast", { detail: { id: counter++, text } }));
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  useEffect(() => {
    function on(e: Event) {
      const det = (e as CustomEvent).detail as ToastMsg;
      setToasts((t) => [...t, det]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== det.id)), 2500);
    }
    window.addEventListener("ll:toast", on as any);
    return () => window.removeEventListener("ll:toast", on as any);
  }, []);
  return (
    <div className="fixed top-3 right-3 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="px-3 py-2 rounded-xl bg-accent text-white shadow">{t.text}</div>
      ))}
    </div>
  );
}

