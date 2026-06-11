import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assertion function that verifies a given function throws an error.
 * Returns the thrown error for further assertions.
 * Note this function does not apply type-narrowing via an assertion signature.
 * Use assertInstanceOf on the returned error to narrow its type.
 * Use assertThrowsError when you expect a real Error instance from the current
 * JavaScript realm.
 * Use assertThrowsErrorLike for cross-realm errors, such as values thrown from
 * Node vm contexts, iframes, workers, or other environments where instanceof
 * Error may fail.
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
