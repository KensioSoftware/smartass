import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that a value is non-nullable, with type-narrowing.
 */
export function assertNonNullable<T>(
  value: T,
  message?: string,
): asserts value is NonNullable<T> {
  if (value === null) {
    throw new AssertionError(
      message ?? "Expected value not to be null, but it was null.",
    );
  }
  if (value === undefined) {
    throw new AssertionError(
      message ?? "Expected value not to be undefined, but it was undefined.",
    );
  }
}
