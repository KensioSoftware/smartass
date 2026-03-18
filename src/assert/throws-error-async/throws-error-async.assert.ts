import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assertion function that verifies an async function throws an error.
 * Returns the thrown error for further assertions.
 */
export async function assertThrowsErrorAsync(
  fn: () => Promise<unknown>,
  message?: string,
): Promise<Error> {
  try {
    await fn();
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
