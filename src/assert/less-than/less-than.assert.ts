import { AssertionError } from "../../assertion-error.js";
import { assertTypeNumeric } from "../type-numeric/type-numeric.assert.js";
import { desc } from "../../describe/describe.js";
import { lessThan } from "./less-than.match.js";

/**
 * Assert that a numeric value is less than the expected value, with
 * type-narrowing.
 * @example
 * ```ts
 * import { assertLessThan } from "@kensio/smartass";
 *
 * const retrievability: unknown = 0.42;
 *
 * assertLessThan(retrievability, 1);
 *
 * // retrievability is now narrowed to number | bigint
 * ```
 */
export function assertLessThan(
  value: unknown,
  expected: number | bigint,
  message = `Expected ${desc(value)} to be less than ${desc(expected)}.`,
): asserts value is number | bigint {
  assertTypeNumeric(value, message);

  const matcher = lessThan(expected);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
