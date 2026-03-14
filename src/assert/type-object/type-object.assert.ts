import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that a value is of type object, with type-narrowing.
 */
export function assertTypeObject(
  value: unknown,
  message = `Expected ${String(value)} to be of type object, but it was of type ${typeof value}`,
): asserts value is object {
  if (typeof value !== "object") {
    throw new AssertionError(message);
  }
}
