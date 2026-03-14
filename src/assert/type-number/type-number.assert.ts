import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that a value is of type number, with type-narrowing.
 */
export function assertTypeNumber(
  value: unknown,
  message = `Expected ${String(value)} to be of type number, but it was of type ${typeof value}`,
): asserts value is number {
  if (typeof value !== "number") {
    throw new AssertionError(message);
  }
}
