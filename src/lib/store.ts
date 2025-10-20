"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Baby, ULID } from "@/lib/types";

interface UIState {
  unit: "ml" | "oz";
  lastBabyId?: ULID;
  babies: Baby[];
  setUnit: (u: "ml" | "oz") => void;
  setLastBabyId: (id?: ULID) => void;
  setBabies: (b: Baby[]) => void;
}

export const useUIStore = create<UIState>()(immer((set) => ({
  unit: "ml",
  lastBabyId: undefined,
  babies: [],
  setUnit: (u) => set((s) => { s.unit = u; }),
  setLastBabyId: (id) => set((s) => { s.lastBabyId = id; }),
  setBabies: (b) => set((s) => { s.babies = b; }),
})));

