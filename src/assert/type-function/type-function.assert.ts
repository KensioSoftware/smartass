import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeFunction } from "./type-function.match.js";

/**
 * Assert that a value is of type function, with type-narrowing.
 */
export function assertTypeFunction(
  value: unknown,
  message = `Expected ${desc(value)} to be of type function.`,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): asserts value is Function {
  const matcher = typeFunction();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
