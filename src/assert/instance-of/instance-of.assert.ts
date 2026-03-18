import { AssertionError } from "../../assertion-error.js";

/**
 * Assertion function that checks if a value is an instance of a given class, with type-narrowing.
 */
export function assertInstanceOf<T>(
  value: unknown,
  classConstructor: abstract new (...args: never[]) => T,
  message?: string,
): asserts value is T {
  if (!(value instanceof classConstructor)) {
    throw new AssertionError(
      message ??
        `Expected value to be instance of ${classConstructor.name}, but it was not.`,
      value,
      `instanceof ${classConstructor.name}`,
    );
  }
}
