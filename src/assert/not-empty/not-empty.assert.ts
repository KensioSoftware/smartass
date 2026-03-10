import { assertNonNullable } from "../non-nullable/non-nullable.assert";

/**
 * Assertion function a non-empty array, with type-narrowing.
 */
export function assertNotEmpty<T>(
  value: readonly T[] | undefined | null,
  message = "Expected array to be defined and non-empty",
): asserts value is readonly [T, ...T[]] {
  assertNonNullable(value, message);

  if (value.length === 0) {
    throw new Error(message);
  }
}
