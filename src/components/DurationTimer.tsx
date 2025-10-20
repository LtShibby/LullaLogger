"use client";
import { useEffect, useState } from "react";

export default function DurationTimer({ startIso }: { startIso: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const dur = Math.max(0, now - new Date(startIso).getTime());
  const h = Math.floor(dur / 3600000);
  const m = Math.floor((dur % 3600000) / 60000);
  const s = Math.floor((dur % 60000) / 1000);
  return <span>{h}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>;
}

