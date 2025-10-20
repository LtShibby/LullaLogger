export const ML_PER_OZ = 29.5735;

export function mlToOz(ml: number): number {
  return ml / ML_PER_OZ;
}

export function ozToMl(oz: number): number {
  return oz * ML_PER_OZ;
}

export function formatOz1(ml: number): number {
  return Math.round((mlToOz(ml)) * 10) / 10; // 1 decimal
}

