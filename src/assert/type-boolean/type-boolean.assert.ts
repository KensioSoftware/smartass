import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeBoolean } from "./type-boolean.match.js";

/**
 * Assert that a value is of type boolean, with type-narrowing.
 */
export function assertTypeBoolean(
  value: unknown,
  message = `Expected ${desc(value)} to be of type boolean.`,
): asserts value is boolean {
  const matcher = typeBoolean();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
