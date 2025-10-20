import { formatISO, parseISO, startOfDay, endOfDay, isAfter, isBefore, differenceInMilliseconds } from "date-fns";

export function nowIso(): string {
  return formatISO(new Date());
}

export function toIso(d: Date): string {
  return formatISO(d);
}

export function parseIso(s: string): Date {
  return parseISO(s);
}

export function todayRange(): { start: Date; end: Date } {
  const now = new Date();
  return { start: startOfDay(now), end: endOfDay(now) };
}

export function clampDurationMs(ms: number, maxMs = 24 * 60 * 60 * 1000): number {
  return Math.min(Math.max(ms, 0), maxMs);
}

export function durationMsBetween(startIso: string, endIso: string): number {
  return differenceInMilliseconds(parseIso(endIso), parseIso(startIso));
}

export function isWithinToday(iso: string): boolean {
  const d = parseIso(iso);
  const { start, end } = todayRange();
  return (isAfter(d, start) || +d === +start) && (isBefore(d, end) || +d === +end);
}

