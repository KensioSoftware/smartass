import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that a value is of type string, with type-narrowing.
 */
export function assertTypeString(
  value: unknown,
  message = `Expected ${String(value)} to be of type string, but it was of type ${typeof value}`,
): asserts value is string {
  if (typeof value !== "string") {
    throw new AssertionError(message);
  }
}
