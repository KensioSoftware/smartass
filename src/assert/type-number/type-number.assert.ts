import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is of type number, with type-narrowing.
 */
export function assertTypeNumber(
  value: unknown,
  message = `Expected ${desc(value)} to be of type number.`,
): asserts value is number {
  if (typeof value !== "number") {
    throw new AssertionError(message, typeof value, "number");
  }
}
