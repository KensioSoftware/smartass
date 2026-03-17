import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { assertTypeNumber } from "../type-number/type-number.assert.js";

/**
 * Assert that a numeric value, when rounded to the nearest given increment,
 * equals the expected value.
 */
export function assertNumberToNearest(
  value: unknown,
  toNearest: number,
  expected: number,
  message?: string,
): asserts value is number {
  assertTypeNumber(value);

  const rawRounded = Math.round(value / toNearest) * toNearest;

  // Determine decimal places in toNearest to avoid floating point errors
  const parts = toNearest.toString().split(".");
  const decimalPlaces = parts[1]?.length ?? 0;
  const rounded = Number(rawRounded.toFixed(decimalPlaces));

  if (rounded !== expected) {
    throw new AssertionError(
      message ??
        `Expected to equal ${repr(expected)} to nearest ${repr(toNearest)}, got ${repr(value)} rounding to ${repr(rounded)}.`,
      value,
      `${repr(expected)} (to nearest ${repr(toNearest)})`,
    );
  }
}
