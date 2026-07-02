import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { assertTypeNumber } from "../type-number/type-number.assert.js";
import { numberToNearest } from "./number-to-nearest.match.js";

/**
 * Assert that a numeric value, when rounded to the nearest given increment,
 * equals the expected value.
 * @example
 * ```ts
 * import { assertNumberToNearest } from "@kensio/smartass";
 *
 * const total: unknown = 9.995;
 *
 * assertNumberToNearest(total, 10, 0.01);
 *
 * // total is now narrowed to number
 * ```
 */
export function assertNumberToNearest(
  value: unknown,
  expected: number,
  toNearest = 1,
  message?: string,
): asserts value is number {
  assertTypeNumber(value);

  const matcher = numberToNearest(expected, toNearest);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${repr(value)} to ${matcher.describe()}.`,
      value,
      matcher.represent(),
    );
  }
}
