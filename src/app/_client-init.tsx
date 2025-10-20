"use client";
import { useEffect } from "react";
import ToastHost from "@/components/Toast";
import { ensureDevSeed } from "@/lib/seed";

export default function ClientInit() {
  useEffect(() => {
    ensureDevSeed();
  }, []);
  return <ToastHost />;
}

