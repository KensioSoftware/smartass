import {
  arrayIncludingAll,
  type ArrayIncludingAll,
} from "./array-includes-all.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that an array includes all specified elements, with type narrowing.
 * Elements can appear in any order and do not need to be contiguous.
 * Each required element must be present at least once.
 */
export function assertArrayIncludesAll<T, const E extends readonly T[]>(
  value: readonly T[],
  elements: E,
  message?: string,
): asserts value is ArrayIncludingAll<T, E> {
  if (!arrayIncludingAll(elements).matches(value)) {
    const missing = elements.filter((element) => !value.includes(element));

    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to include all of ${repr(elements)}, but missing ${repr(missing)}.`,
      value,
      elements,
    );
  }
}
