import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that a value is one of a set of expected values, with type-narrowing.
 */
export function assertOneOf<const TAllowed extends readonly unknown[]>(
  value: unknown,
  allowed: TAllowed,
  message = `Expected ${desc(value)} to be one of ${repr(allowed)}.`,
): asserts value is TAllowed[number] {
  if (!allowed.includes(value)) {
    throw new AssertionError(message, value, `one of ${desc(allowed)}`);
  }
}
