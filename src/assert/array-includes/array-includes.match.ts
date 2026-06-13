import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

export type ArrayIncluding<T> = [T, ...T[]];

export type ArrayIncludingMatcher = AssertionMatcher<ArrayIncluding<unknown>>;

/**
 * Matcher for an array including a specific single element.
 */
export function arrayIncluding<const E>(element: E): ArrayIncludingMatcher {
  return createMatcher(
    (value): value is ArrayIncluding<unknown> =>
      Array.isArray(value) && value.includes(element),
    () => `array including ${desc(element)}`,
    () => `[…,${repr(element)},…]`,
  );
}
