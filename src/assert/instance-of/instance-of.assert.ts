import { AssertionError } from "../../assertion-error.js";
import { instanceOf } from "./instance-of.match.js";

/**
 * Assertion function that checks if a value is an instance of a given class, with type-narrowing.
 */
export function assertInstanceOf<T>(
  value: unknown,
  classConstructor: abstract new (...args: never[]) => T,
  message?: string,
): asserts value is T {
  const matcher = instanceOf(classConstructor);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected value to be ${matcher.describe()}, but it was not.`,
      value,
      matcher.represent(),
    );
  }
}
