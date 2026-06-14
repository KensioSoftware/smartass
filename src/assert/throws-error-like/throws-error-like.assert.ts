import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import type { ErrorLike } from "./throws-error-like.type.js";

/**
 * Assertion function that verifies a given function throws something that
 * appears to be an error.
 * Returns the thrown error-like object for further assertions.
 * Note this function does not apply type-narrowing via an assertion signature.
 * Use assertInstanceOf on the returned error-like object to narrow its type.
 * Use assertThrowsErrorLike for cross-realm errors, such as values thrown from
 * Node vm contexts, iframes, workers, or other environments where instanceof
 * Error may fail.
 * Use assertThrowsError when you expect a real Error instance from the current
 * JavaScript realm.
 */
export function assertThrowsErrorLike(
  fn: () => unknown,
  message?: string,
): ErrorLike {
  try {
    fn();
  } catch (error) {
    if (isErrorLike(error)) {
      return error;
    }

    throw new AssertionError(
      message ??
        `Expected ${desc(fn)} to throw Error-like object, but it threw ${desc(error)}.`,
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

function isErrorLike(value: unknown): value is ErrorLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "message" in value &&
    typeof value.name === "string" &&
    typeof value.message === "string"
  );
}
