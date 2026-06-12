import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeNumber } from "./type-number.match.js";

/**
 * Assert that a value is of type number, with type-narrowing.
 */
export function assertTypeNumber(
  value: unknown,
  message = `Expected ${desc(value)} to be of type number.`,
): asserts value is number {
  const matcher = typeNumber();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
