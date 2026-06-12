import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeObject } from "./type-object.match.js";

/**
 * Assert that a value is of type object, with type-narrowing.
 */
export function assertTypeObject(
  value: unknown,
  message = `Expected ${desc(value)} to be of type object.`,
): asserts value is object {
  const matcher = typeObject();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
