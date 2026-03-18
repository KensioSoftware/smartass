import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is strictly false (not just falsy), with type-narrowing
 * to the literal type `false`.
 */
export function assertFalse(
  value: unknown,
  message = `Expected ${desc(value)} to be ${desc(false)}.`,
): asserts value is false {
  if (value !== false) {
    throw new AssertionError(message, value, false);
  }
}
