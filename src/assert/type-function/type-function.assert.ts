import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that a value is of type function, with type-narrowing.
 */
export function assertTypeFunction(
  value: unknown,
  message = `Expected ${String(value)} to be of type function, but it was of type ${typeof value}`,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): asserts value is Function {
  if (typeof value !== "function") {
    throw new AssertionError(message);
  }
}
