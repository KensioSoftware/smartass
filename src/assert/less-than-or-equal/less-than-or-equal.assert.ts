import { AssertionError } from "../../assertion-error.js";
import { assertTypeNumeric } from "../type-numeric/type-numeric.assert.js";
import { desc } from "../../describe/describe.js";
import { lessThanOrEqual } from "./less-than-or-equal.match.js";

/**
 * Assert that a numeric value is less than or equal to the expected value, with
 * type-narrowing.
 * @example
 * ```ts
 * import { assertLessThanOrEqual } from "@kensio/smartass";
 *
 * const errorRate: unknown = 0;
 *
 * assertLessThanOrEqual(errorRate, 0.01);
 *
 * // errorRate is now narrowed to number | bigint
 * ```
 */
export function assertLessThanOrEqual(
  value: unknown,
  expected: number | bigint,
  message = `Expected ${desc(value)} to be less than or equal to ${desc(expected)}.`,
): asserts value is number | bigint {
  assertTypeNumeric(value, message);

  const matcher = lessThanOrEqual(expected);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
