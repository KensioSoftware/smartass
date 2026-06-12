import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeNumeric } from "./type-numeric.match.js";

/**
 * Assert that a value is numeric (number or bigint), with type-narrowing.
 */
export function assertTypeNumeric(
  value: unknown,
  message = `Expected ${desc(value)} to be of type number or bigint.`,
): asserts value is number | bigint {
  const matcher = typeNumeric();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
