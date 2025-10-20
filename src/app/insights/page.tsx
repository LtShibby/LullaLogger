"use client";
import { useEffect, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { listEvents } from "@/lib/events";
import { format, subDays } from "date-fns";
import type { BaseEvent } from "@/lib/types";

export default function Insights() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? location.search : "");
  const babyId = params.get("baby") as any;
  const [events, setEvents] = useState<BaseEvent[]>([]);
  useEffect(() => { if (babyId) (async () => setEvents(await listEvents({ babyId })))(); }, [babyId]);
  const today = format(new Date(), "yyyy-MM-dd");
  const last7 = subDays(new Date(), 7);

  const todayFeed = events.filter(e => e.type === "feed.single" && e.at.startsWith(today));
  const totalConsumed = todayFeed.reduce((s, e) => s + Number((e.meta as any)?.consumed || 0), 0);
  const totalSpit = todayFeed.reduce((s, e) => s + Number((e.meta as any)?.spit_up_ml || 0), 0);
  const net = Math.max(0, totalConsumed - totalSpit);

  const last7Feeds = events.filter(e => e.type === "feed.single" && new Date(e.at) >= last7);
  const feedsPerDay = (last7Feeds.length / 7).toFixed(1);
  const avgPerFeed = last7Feeds.length ? Math.round(last7Feeds.reduce((s,e)=>s+Number((e.meta as any)?.consumed||0),0) / last7Feeds.length) : 0;
  const totalSleepMsToday = events.filter(e=>e.type==="sleep.end" && e.at.startsWith(today)).reduce((s,e)=>s+(e.dur_ms||0),0);

  return (
    <main className="container-md">
      <HeaderBar title="Insights" backHref={babyId?`/baby/${babyId}`:"/"} />
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="text-sm opacity-70">Today: Total Sleep</div>
          <div className="text-2xl font-semibold">{Math.round(totalSleepMsToday/3600000*10)/10} h</div>
        </div>
        <div className="card p-4">
          <div className="text-sm opacity-70">Today: Net Intake</div>
          <div className="text-2xl font-semibold">{net} ml</div>
        </div>
        <div className="card p-4">
          <div className="text-sm opacity-70">7d: Feeds/Day</div>
          <div className="text-2xl font-semibold">{feedsPerDay}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm opacity-70">7d: Avg per Feed</div>
          <div className="text-2xl font-semibold">{avgPerFeed} ml</div>
        </div>
      </div>
    </main>
  );
}

