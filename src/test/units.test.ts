import { describe, it, expect } from "vitest";
import { ML_PER_OZ, mlToOz, ozToMl, formatOz1 } from "@/lib/units";

describe("units conversion", () => {
  it("converts oz -> ml and ml -> oz approximately inverses", () => {
    const oz = 5.5;
    const ml = ozToMl(oz);
    expect(Math.abs(ml - oz * ML_PER_OZ)).toBeLessThan(1e-9);
    const oz2 = mlToOz(ml);
    expect(Math.abs(oz2 - oz)).toBeLessThan(1e-10);
  });

  it("rounds oz display to 1 decimal", () => {
    const ml = 118; // ~4.0 oz
    expect(formatOz1(ml)).toBeCloseTo(4.0, 1);
    const ml2 = 148; // ~5.0 oz
    expect(formatOz1(ml2)).toBeCloseTo(5.0, 1);
  });
});

