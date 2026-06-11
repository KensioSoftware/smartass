import { type AssertionMatcher, createMatcher } from "../../match/match.js";

export type NonEmptyArray<T> = readonly [T, ...T[]];

/**
 * Matcher for a non-empty array.
 */
export function nonEmptyArray<T>(): AssertionMatcher<NonEmptyArray<T>> {
  return createMatcher(
    (value): value is NonEmptyArray<T> =>
      Array.isArray(value) && value.length > 0,
    () => `non-empty array`,
    () => `[...]`,
  );
}
