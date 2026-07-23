import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assertion function that verifies an async function throws an error.
 * Returns the thrown error for further assertions.
 * @example
 * ```ts
 * import { assertThrowsErrorAsync } from "@kensio/smartass";
 *
 * const error = await assertThrowsErrorAsync(async () => loadUser("missing"));
 *
 * // error is returned as Error; this assertion does not narrow another value.
 * ```
 */
export async function assertThrowsErrorAsync(
  callable: () => Promise<unknown>,
  message?: string,
): Promise<Error> {
  try {
    await callable();
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    throw new AssertionError(
      message ??
        `Expected ${desc(callable)} to throw Error, but it threw ${desc(error)}.`,
      error,
      Error,
    );
  }

  throw new AssertionError(
    message ?? `Expected ${desc(callable)} to throw, but it did not.`,
    undefined,
    Error,
  );
}
