import { arrayOfLength } from "./array-length.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import type { ArrayOfLength } from "./array-length.type.js";

export function assertArrayLength<
  TArray extends unknown[],
  const N extends number,
>(
  value: TArray,
  expectedLength: N,
  message?: string,
): asserts value is TArray & ArrayOfLength<TArray[number], N>;

export function assertArrayLength<const N extends number>(
  value: unknown,
  expectedLength: N,
  message?: string,
): asserts value is ArrayOfLength<unknown, N>;

/**
 * Assert that an array has exactly the expected length, with type narrowing.
 * The type narrowing indicates:
 *  - An empty array for 0
 *  - An exact number of elements up to 10
 *  - At least 10 elements for >10
 */
export function assertArrayLength(
  value: unknown,
  expectedLength: number,
  message?: string,
): void {
  const matcher = arrayOfLength(expectedLength);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildArrayLengthMessage(value, expectedLength),
      value,
      matcher.represent(),
    );
  }
}

function buildArrayLengthMessage(
  value: unknown,
  expectedLength: number,
): string {
  if (!Array.isArray(value)) {
    return `Expected ${desc(value)} to be an array of length ${repr(expectedLength)}.`;
  }

  return `Expected ${desc(value)} to have length ${repr(expectedLength)}, but it had length ${repr(value.length)}.`;
}
