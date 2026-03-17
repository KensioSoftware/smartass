import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is of type object, with type-narrowing.
 */
export function assertTypeObject(
  value: unknown,
  message = `Expected ${desc(value)} to be of type object.`,
): asserts value is object {
  if (typeof value !== "object") {
    throw new AssertionError(message, typeof value, "object");
  }
}
