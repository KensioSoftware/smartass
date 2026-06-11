import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

export type ArrayIncluding<T, E extends T> = readonly [T, ...T[]] & {
  includes(searchElement: E): true;
};

/**
 * Matcher for an array including a specific single element.
 */
export function arrayIncluding<const E>(
  element: E,
): AssertionMatcher<ArrayIncluding<unknown, E>> {
  return createMatcher(
    (value): value is ArrayIncluding<unknown, E> =>
      Array.isArray(value) && value.includes(element),
    () => `array including ${desc(element)}`,
    () => `[${repr(element)}]`,
  );
}
