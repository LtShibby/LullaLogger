import { dbGet, dbSet, dbList } from "@/lib/db";
import { generateId } from "@/lib/id";
import type { Baby, Gender, ULID } from "@/lib/types";

const BABIES_KEY = "babies:"; // babies:<id>
const LAST_BABY = "last-baby";

export async function listBabies(): Promise<Baby[]> {
  const rows = await dbList(BABIES_KEY);
  return rows.map((r) => r.value as Baby).sort((a, b) => a.name.localeCompare(b.name));
}

export async function createBaby(name: string, gender: Gender): Promise<Baby> {
  const id = generateId();
  const baby: Baby = { id, name, gender };
  await dbSet(BABIES_KEY + id, baby);
  await setLastBaby(id);
  return baby;
}

export async function getBaby(id: ULID): Promise<Baby | undefined> {
  return dbGet<Baby>(BABIES_KEY + id);
}

export async function setLastBaby(id: ULID): Promise<void> {
  await dbSet(LAST_BABY, id);
}

export async function getLastBaby(): Promise<ULID | undefined> {
  return dbGet<ULID>(LAST_BABY);
}

