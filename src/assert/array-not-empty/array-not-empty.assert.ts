import { assertNonNullable } from "../non-nullable/non-nullable.assert.js";
import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that an array has at least one element, with type-narrowing.
 */
export function assertArrayNotEmpty<T>(
  value: readonly T[] | undefined | null,
  message?: string,
): asserts value is readonly [T, ...T[]] {
  assertNonNullable(value, message);

  if (value.length === 0) {
    throw new AssertionError(
      message ?? `Expected array not to be empty, but it was empty.`,
      value,
      ["..."],
    );
  }
}
