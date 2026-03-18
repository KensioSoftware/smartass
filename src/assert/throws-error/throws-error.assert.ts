import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assertion function that verifies a given function throws an error.
 * Returns the thrown error for further assertions.
 * Note this function does not apply type-narrowing via an assertion signature.
 */
export function assertThrowsError(fn: () => unknown, message?: string): Error {
  try {
    fn();
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    throw new AssertionError(
      message ??
        `Expected ${desc(fn)} to throw Error, but it threw ${desc(error)}.`,
      error,
      Error,
    );
  }

  throw new AssertionError(
    message ?? `Expected ${desc(fn)} to throw, but it did not.`,
    undefined,
    Error,
  );
}
