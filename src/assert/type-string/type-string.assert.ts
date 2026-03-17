import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is of type string, with type-narrowing.
 */
export function assertTypeString(
  value: unknown,
  message = `Expected ${desc(value)} to be of type string.`,
): asserts value is string {
  if (typeof value !== "string") {
    throw new AssertionError(message, typeof value, "string");
  }
}
