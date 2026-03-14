import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that a value is of type boolean, with type-narrowing.
 */
export function assertTypeBoolean(
  value: unknown,
  message = `Expected ${String(value)} to be of type boolean, but it was of type ${typeof value}`,
): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new AssertionError(message);
  }
}
