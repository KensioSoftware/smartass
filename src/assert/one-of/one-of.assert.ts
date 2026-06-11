import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { oneOf } from "./one-of.match.js";

/**
 * Assert that a value is one of a set of expected values, with type-narrowing.
 */
export function assertOneOf<const TAllowed extends readonly unknown[]>(
  value: unknown,
  allowed: TAllowed,
  message?: string,
): asserts value is TAllowed[number] {
  const matcher = oneOf(allowed);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} to be ${matcher.describe()}.`,
      value,
      matcher.represent(),
    );
  }
}
