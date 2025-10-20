"use client";
import { useEffect, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import EventList from "@/components/EventList";
import { eventsForToday } from "@/lib/selectors";
import type { BaseEvent } from "@/lib/types";

export default function Timeline() {
  const [events, setEvents] = useState<BaseEvent[]>([]);
  const params = new URLSearchParams(typeof window !== 'undefined' ? location.search : "");
  const babyId = params.get("baby") as any;
  useEffect(() => {
    if (!babyId) return;
    (async () => setEvents(await eventsForToday(babyId)))();
  }, [babyId]);
  return (
    <main className="container-md">
      <HeaderBar title="Timeline" backHref={babyId?`/baby/${babyId}`:"/"} />
      <EventList events={events} />
    </main>
  );
}

