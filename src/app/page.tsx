"use client";
import { useEffect, useState } from "react";
import AddBabyModal from "@/components/AddBabyModal";
import BabyCard from "@/components/BabyCard";
import { listBabies } from "@/lib/babies";
import ClientInit from "@/app/_client-init";
import type { Baby } from "@/lib/types";

export default function Page() {
  const [babies, setBabies] = useState<Baby[]>([]);
  useEffect(() => {
    (async () => setBabies(await listBabies()))();
  }, []);
  return (
    <main className="container-md">
      <ClientInit />
      <div className="space-y-3">
        {babies.map((b) => (<BabyCard key={b.id} baby={b} />))}
      </div>
      <AddBabyModal onCreated={async ()=> setBabies(await listBabies())} />
    </main>
  );
}

