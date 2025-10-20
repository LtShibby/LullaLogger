import { get as idbGet, set as idbSet, del as idbDel, keys, update } from "idb-keyval";

const NS = "ll:v1:";

function k(key: string): string {
  return NS + key;
}

export async function dbGet<T>(key: string): Promise<T | undefined> {
  return idbGet(k(key));
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  await idbSet(k(key), value as any);
}

export async function dbDel(key: string): Promise<void> {
  await idbDel(k(key));
}

export async function dbList(prefix: string): Promise<Array<{ key: string; value: any }>> {
  const allKeys = await keys();
  const out: Array<{ key: string; value: any }> = [];
  for (const key of allKeys) {
    if (typeof key === "string" && key.startsWith(k(prefix))) {
      const value = await idbGet(key);
      out.push({ key: key.substring(NS.length), value });
    }
  }
  return out;
}

export async function dbUpdate<T>(key: string, fn: (prev: T | undefined) => T): Promise<T> {
  const full = k(key);
  // idb-keyval update is atomic-ish
  const value = await update(full, (prev: any) => fn(prev as T | undefined) as any);
  return value as T;
}

