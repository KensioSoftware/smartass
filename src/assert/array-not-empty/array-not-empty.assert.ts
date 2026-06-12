import { assertNonNullable } from "../non-nullable/non-nullable.assert.js";
import { type NonEmptyArray, nonEmptyArray } from "./array-not-empty.match.js";
import { AssertionError } from "../../assertion-error.js";

/**
 * Assert that an array has at least one element, with type-narrowing.
 */
export function assertArrayNotEmpty<T>(
  value: readonly T[] | undefined | null,
  message?: string,
): asserts value is NonEmptyArray<T> {
  assertNonNullable(value, message);

  if (!nonEmptyArray().matches(value)) {
    throw new AssertionError(
      message ?? `Expected array not to be empty, but it was empty.`,
      value,
      ["..."],
    );
  }
}
