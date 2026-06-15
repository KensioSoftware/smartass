import { repr } from "../../describe/describe.js";
import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a number that, when rounded to the nearest given increment,
 * equals the expected value.
 */
export function numberToNearest(
  expected: number,
  toNearest = 1,
): AssertionMatcher<number> {
  return createMatcher(
    (value): value is number =>
      typeof value === "number" &&
      roundToNearest(value, toNearest) === expected,
    () => `equal ${repr(expected)} to nearest ${repr(toNearest)}`,
    () => `≈₍${repr(toNearest)}₎${repr(expected)}`,
  );
}

function roundToNearest(value: number, toNearest: number): number {
  const rawRounded = Math.round(value / toNearest) * toNearest;

  // Determine decimal places in toNearest to avoid floating point errors
  const parts = toNearest.toString().split(".");
  const decimalPlaces = parts[1]?.length ?? 0;

  return Number(rawRounded.toFixed(decimalPlaces));
}
