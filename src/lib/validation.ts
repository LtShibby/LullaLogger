export function nonNegativeNumber(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

export function isAfterIso(a: string, b: string): boolean {
  return new Date(a).getTime() > new Date(b).getTime();
}

export function clampAbsurdDuration(ms: number): number {
  const day = 24 * 60 * 60 * 1000;
  if (ms < 0) return 0;
  if (ms > day) return day;
  return ms;
}

