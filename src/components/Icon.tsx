export default function Icon({ name, className }: { name: string; className?: string }) {
  const map: Record<string, string> = {
    feed: "🍶",
    sleep: "😴",
    change: "🧷",
    timeline: "🕒",
    insights: "📊",
  };
  return <span className={className}>{map[name] ?? "⭐"}</span>;
}

