import { AssertionError } from "../../assertion-error.js";
import { assertTypeNumeric } from "../type-numeric/type-numeric.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { numberBetween } from "./number-between.match.js";

/**
 * Assert that a numeric value is between min and max inclusive, with
 * type-narrowing.
 * @example
 * ```ts
 * import { assertNumberBetween } from "@kensio/smartass";
 *
 * const score: unknown = 87;
 *
 * assertNumberBetween(score, 0, 100);
 *
 * // score is now narrowed to number | bigint
 * ```
 */
export function assertNumberBetween(
  value: unknown,
  min: number | bigint,
  max: number | bigint,
  message = `Expected ${desc(value)} to be between ${desc(min)} and ${desc(max)} inclusive.`,
): asserts value is number | bigint {
  assertTypeNumeric(value, message);
  if (!numberBetween(min, max).isMatch(value)) {
    throw new AssertionError(
      message,
      value,
      `${repr(min)} ≤ ${repr(value)} ≤ ${repr(max)}`,
    );
  }
}
