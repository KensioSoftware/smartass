import { arrayIncluding } from "./array-includes.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import type { ArrayIncluding } from "./array-includes.type.js";

export function assertArrayIncludes<
  T,
  const E extends T,
  TArray extends readonly T[],
>(
  value: TArray,
  element: E,
  message?: string,
): asserts value is TArray & ArrayIncluding<E>;

export function assertArrayIncludes<const E>(
  value: unknown,
  element: E,
  message?: string,
): asserts value is ArrayIncluding<E>;

/**
 * Assert that an array includes a specific element, with type narrowing.
 * Note that this is an identity match, so objects in an array only fulfill the
 * assertion by being a reference to the same object, rather than equivalent in
 * value to another object reference.
 */
export function assertArrayIncludes(
  value: unknown,
  element: unknown,
  message?: string,
): void {
  const matcher = arrayIncluding(element);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to include ${desc(element)}, but it did not.`,
      value,
      matcher.represent(),
    );
  }
}
