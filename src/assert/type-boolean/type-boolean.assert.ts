import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is of type boolean, with type-narrowing.
 */
export function assertTypeBoolean(
  value: unknown,
  message = `Expected ${desc(value)} to be of type boolean.`,
): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new AssertionError(message, typeof value, "boolean");
  }
}
