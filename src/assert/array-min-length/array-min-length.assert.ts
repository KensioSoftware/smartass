import {
  arrayOfMinLength,
  type ArrayOfMinLength,
} from "./array-min-length.match.js";
import { assertNonNullable } from "../non-nullable/non-nullable.assert.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that an array has at least the expected minimum length, with type narrowing.
 * The type narrowing indicates:
 *  - A non-empty array for 1
 *  - At least N elements up to 5
 *  - At least 5 elements for >5
 */
export function assertArrayMinLength<T, const N extends number>(
  value: readonly T[] | undefined | null,
  minLength: N,
  message?: string,
): asserts value is ArrayOfMinLength<T, N> {
  assertNonNullable(value, message);

  if (!arrayOfMinLength(minLength).matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to have at least ${repr(minLength)} elements, but it had ${repr(value.length)}.`,
      value,
      { minLength },
    );
  }
}
