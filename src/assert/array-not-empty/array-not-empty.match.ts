import { type AssertionMatcher, createMatcher } from "../../match/match.js";

export type NonEmptyArray<T> = readonly [T, ...T[]];

export type NonEmptyArrayMatcher = AssertionMatcher<NonEmptyArray<unknown>>;

/**
 * Matcher for a non-empty array.
 */
export function nonEmptyArray(): NonEmptyArrayMatcher {
  return createMatcher(
    (value): value is NonEmptyArray<unknown> =>
      Array.isArray(value) && value.length > 0,
    () => `non-empty array`,
    () => `[…]`,
  );
}
