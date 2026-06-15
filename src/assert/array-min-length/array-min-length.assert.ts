import { arrayOfMinLength } from "./array-min-length.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import type { ArrayOfMinLength } from "./array-min-length.type.js";

export function assertArrayMinLength<
  TArray extends unknown[],
  const N extends number,
>(
  value: TArray,
  minLength: N,
  message?: string,
): asserts value is TArray & ArrayOfMinLength<TArray[number], N>;

export function assertArrayMinLength<const N extends number>(
  value: unknown,
  minLength: N,
  message?: string,
): asserts value is ArrayOfMinLength<unknown, N>;

/**
 * Assert that an array has at least the expected minimum length, with type narrowing.
 * The type narrowing indicates:
 *  - A non-empty array for 1
 *  - At least N elements up to 5
 *  - At least 5 elements for >5
 */
export function assertArrayMinLength(
  value: unknown,
  minLength: number,
  message?: string,
): void {
  const matcher = arrayOfMinLength(minLength);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildArrayMinLengthMessage(value, minLength),
      value,
      matcher.represent(),
    );
  }
}

function buildArrayMinLengthMessage(value: unknown, minLength: number): string {
  if (!Array.isArray(value)) {
    return `Expected ${desc(value)} to be an array of at least ${repr(minLength)} elements.`;
  }

  return `Expected ${desc(value)} to have at least ${repr(minLength)} elements, but it had ${repr(value.length)}.`;
}
