import type { BaseEvent } from "@/lib/types";

export default function EventList({ events }: { events: BaseEvent[] }) {
  return (
    <div className="space-y-2">
      {events.map(e => (
        <div key={e.id} className="card p-3 text-sm flex justify-between">
          <div>
            <div className="font-semibold">{e.type}</div>
            <div className="opacity-70">{new Date(e.at).toLocaleTimeString()}</div>
          </div>
          {e.meta && <div className="text-right opacity-80">{JSON.stringify(e.meta)}</div>}
        </div>
      ))}
    </div>
  );
}

