import { AssertionError } from "../../assertion-error.js";
import { assertTypeNumeric } from "../type-numeric/type-numeric.assert.js";
import { desc } from "../../describe/describe.js";
import { greaterThanOrEqual } from "./greater-than-or-equal.match.js";

/**
 * Assert that a numeric value is greater than or equal to the expected value,
 * with type-narrowing.
 * @example
 * ```ts
 * import { assertGreaterThanOrEqual } from "@kensio/smartass";
 *
 * const attempts: unknown = 1;
 *
 * assertGreaterThanOrEqual(attempts, 1);
 *
 * // attempts is now narrowed to number | bigint
 * ```
 */
export function assertGreaterThanOrEqual(
  value: unknown,
  expected: number | bigint,
  message = `Expected ${desc(value)} to be greater than or equal to ${desc(expected)}.`,
): asserts value is number | bigint {
  assertTypeNumeric(value, message);

  const matcher = greaterThanOrEqual(expected);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
