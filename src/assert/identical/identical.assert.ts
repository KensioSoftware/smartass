import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is strictly identical to an expected value using ===,
 * with type-narrowing.
 * @example
 * ```ts
 * import { assertIdentical } from "@kensio/smartass";
 *
 * const status: unknown = "active";
 *
 * assertIdentical(status, "active");
 *
 * // status is now narrowed to "active"
 * ```
 */
export function assertIdentical<const TExpected>(
  value: unknown,
  expected: TExpected,
  message = `Expected ${desc(value)} to be identical to ${desc(expected)}.`,
): asserts value is TExpected {
  if (value !== expected) {
    throw new AssertionError(message, value, expected);
  }
}
