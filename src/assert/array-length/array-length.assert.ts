import { arrayOfLength } from "./array-length.match.js";
import { assertNonNullable } from "../non-nullable/non-nullable.assert.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import type { ArrayOfLength } from "./array-length.type.js";

/**
 * Assert that an array has exactly the expected length, with type narrowing.
 * The type narrowing indicates:
 *  - An empty array for 0
 *  - An exact number of elements up to 10
 *  - At least 10 elements for >10
 */
export function assertArrayLength<T, const N extends number>(
  value: readonly T[] | undefined | null,
  expectedLength: N,
  message?: string,
): asserts value is ArrayOfLength<T, N> {
  assertNonNullable(value, message);
  const matcher = arrayOfLength(expectedLength);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to have length ${repr(expectedLength)}, but it had length ${repr(value.length)}.`,
      value,
      matcher.represent(),
    );
  }
}
