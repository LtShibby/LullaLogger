"use client";
import { useEffect, useState } from "react";
import { getBaby } from "@/lib/babies";
import { ThemeProvider } from "@/lib/theme";
import type { Baby } from "@/lib/types";

export default function BabyLayout({ children, params }: { children: React.ReactNode; params: { babyId: string } }) {
  const [baby, setBaby] = useState<Baby | undefined>();
  useEffect(() => { (async () => setBaby(await getBaby(params.babyId as any)) )(); }, [params.babyId]);
  const gender = baby?.gender ?? "neutral";
  return <ThemeProvider gender={gender}>{children}</ThemeProvider>;
}

