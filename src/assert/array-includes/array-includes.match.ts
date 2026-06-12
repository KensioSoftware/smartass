import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

export type ArrayIncluding<T, E extends T> = Omit<
  readonly [T, ...T[]],
  "includes"
> & {
  includes(searchElement: E, fromIndex?: number): true;
  includes(searchElement: T, fromIndex?: number): boolean;
};

export type ArrayIncludingMatcher<E> = AssertionMatcher<
  ArrayIncluding<unknown, E>
>;

/**
 * Matcher for an array including a specific single element.
 */
export function arrayIncluding<const E>(element: E): ArrayIncludingMatcher<E> {
  return createMatcher(
    (value): value is ArrayIncluding<unknown, E> =>
      Array.isArray(value) && value.includes(element),
    () => `array including ${desc(element)}`,
    () => `[…,${repr(element)},…]`,
  );
}
