import type { Baby } from "@/lib/types";

export default function BabyCard({ baby }: { baby: Baby }) {
  return (
    <a href={`/baby/${baby.id}`} className="card p-4 flex items-center justify-between">
      <div className="text-lg font-semibold">{baby.name}</div>
      <div className="text-2xl">👶</div>
    </a>
  );
}

