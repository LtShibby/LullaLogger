"use client";
import { useEffect, useState } from "react";
import BigButton from "@/components/BigButton";
import HeaderBar from "@/components/HeaderBar";
import { getBaby } from "@/lib/babies";
import type { Baby } from "@/lib/types";

export default function BabyDashboard({ params }: { params: { babyId: string } }) {
  const [baby, setBaby] = useState<Baby | undefined>();
  useEffect(() => { (async () => setBaby(await getBaby(params.babyId as any)))(); }, [params.babyId]);
  return (
    <main className="container-md">
      <HeaderBar title={baby?.name ?? "Baby"} backHref="/" />
      <div className="space-y-3">
        <BigButton href={`/baby/${params.babyId}/new-event`}>New Event</BigButton>
        <BigButton href={`/insights?baby=${params.babyId}`}>Insights</BigButton>
        <BigButton href={`/timeline?baby=${params.babyId}`}>Timeline</BigButton>
      </div>
    </main>
  );
}

