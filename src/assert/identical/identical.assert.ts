import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is strictly identical to an expected value using ===,
 * with type-narrowing.
 */
export function assertIdentical<const TExpected>(
  value: unknown,
  expected: TExpected,
  message = `Expected ${desc(value)} to be identical to ${desc(expected)}.`,
): asserts value is typeof expected {
  if (value !== expected) {
    throw new AssertionError(message, value, expected);
  }
}
