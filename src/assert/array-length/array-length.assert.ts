import { assertNonNullable } from "../non-nullable/non-nullable.assert.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that an array has exactly the expected length, with type narrowing.
 * The type narrowing indicates:
 *  - An empty array for 0
 *  - An exact number of elements up to 5
 *  - At least 5 elements for >5
 */
export function assertArrayLength<T, const N extends number>(
  value: readonly T[] | undefined | null,
  expectedLength: N,
  message?: string,
): asserts value is N extends 0
  ? readonly []
  : N extends 1
    ? readonly [T]
    : N extends 2
      ? readonly [T, T]
      : N extends 3
        ? readonly [T, T, T]
        : N extends 4
          ? readonly [T, T, T, T]
          : N extends 5
            ? readonly [T, T, T, T, T]
            : readonly [T, T, T, T, T, ...T[]] & {
                length: N;
              } {
  assertNonNullable(value, message);

  if (value.length !== expectedLength) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to have length ${repr(expectedLength)}, but it had length ${repr(value.length)}.`,
      value,
      { length: expectedLength },
    );
  }
}
