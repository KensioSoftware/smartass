import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { assertTypeNumber } from "../type-number/type-number.assert.js";
import { numberToNearest } from "./number-to-nearest.match.js";

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

  const matcher = numberToNearest(toNearest, expected);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${repr(value)} to ${matcher.describe()}.`,
      value,
      matcher.represent(),
    );
  }
}
