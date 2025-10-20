export type ULID = string;

export type Gender = "neutral" | "male" | "female";
export type FeedMethod = "bottle" | "breast" | "tube" | "cup" | "spoon";
export type Unit = "ml" | "oz";
export type BreastSide = "L" | "R" | "both";

export type EventType =
  | "sleep.start" | "sleep.end"
  | "feed.start"  | "feed.end"  | "feed.single"
  | "diaper" | "pump" | "med" | "note";

export interface Baby {
  id: ULID;
  name: string;
  gender: Gender; // controls theme
}

export interface FeedMeta {
  offered?: number;      // stored internally as ml
  consumed?: number;     // stored internally as ml
  unit?: Unit;           // UI/display only
  method?: FeedMethod;
  formula_brand?: string;
  fortifier?: boolean;
  breast_side?: BreastSide;
  duration_ms?: number;  // usage for breast/pump
  spit_up_ml?: number;
  notes?: string;
}

export interface BaseEvent {
  id: ULID;
  baby_id: ULID;
  type: EventType;
  at: string;            // ISO8601
  dur_ms?: number;
  meta?: FeedMeta | Record<string, any>;
  created_at: string;    // ISO
  client_rev: number;    // monotonic per device
  deleted?: boolean;
}

export interface DaySummary {
  id: ULID;              // babyId+YYYY-MM-DD
  baby_id: ULID;
  date: string;          // YYYY-MM-DD (baby tz not required in MVP)
  total_sleep_ms: number;
  total_feed_ml: number;
  total_offered_ml: number;
  net_intake_ml: number; // consumed - spit_up
  sessions: {
    sleeps: Array<{ start: string; end: string; dur_ms: number; }>;
    feeds: Array<{
      at: string;
      method?: FeedMethod;
      consumed_ml?: number;
      offered_ml?: number;
      spit_up_ml?: number;
      unit?: Unit;
      duration_ms?: number;
      breast_side?: BreastSide;
      notes?: string;
    }>;
  };
}

