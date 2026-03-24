import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that an array includes a specific element, with type narrowing.
 * Note that this is an identity match, so objects in an array only fulfill the
 * assertion by being a reference to the same object, rather than equivalent in
 * value to another object reference.
 */
export function assertArrayIncludes<T, const E extends T>(
  value: readonly T[],
  element: E,
  message?: string,
): asserts value is readonly [T, ...T[]] & {
  includes(searchElement: E): true;
} {
  if (!value.includes(element)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to include ${desc(element)}, but it did not.`,
      value,
      [element],
    );
  }
}
