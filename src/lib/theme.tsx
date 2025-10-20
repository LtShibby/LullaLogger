"use client";
import { useEffect } from "react";
import type { Gender } from "@/lib/types";

export function ThemeProvider({ gender, children }: { gender?: Gender; children: React.ReactNode }) {
  useEffect(() => {
    const theme = gender ?? "neutral";
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [gender]);
  return children as any;
}

