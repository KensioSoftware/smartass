import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is strictly undefined, with type-narrowing to the
 * `undefined` type.
 */
export function assertUndefined(
  value: unknown,
  message = `Expected ${desc(value)} to be ${desc()}.`,
): asserts value is undefined {
  if (value !== undefined) {
    throw new AssertionError(message, value, undefined);
  }
}
