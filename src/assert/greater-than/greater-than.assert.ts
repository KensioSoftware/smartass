import { AssertionError } from "../../assertion-error.js";
import { assertTypeNumeric } from "../type-numeric/type-numeric.assert.js";
import { desc } from "../../describe/describe.js";
import { greaterThan } from "./greater-than.match.js";

/**
 * Assert that a numeric value is greater than the expected value, with
 * type-narrowing.
 * @example
 * ```ts
 * import { assertGreaterThan } from "@kensio/smartass";
 *
 * const elapsed: unknown = 120;
 *
 * assertGreaterThan(elapsed, 0);
 *
 * // elapsed is now narrowed to number | bigint
 * ```
 */
export function assertGreaterThan(
  value: unknown,
  expected: number | bigint,
  message = `Expected ${desc(value)} to be greater than ${desc(expected)}.`,
): asserts value is number | bigint {
  assertTypeNumeric(value, message);

  const matcher = greaterThan(expected);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
