import { type AssertionMatcher, createMatcher } from "../../match/match.js";

export type NonNullableMatcher = AssertionMatcher<NonNullable<unknown>>;

/**
 * Matcher for a non-nullable value.
 */
export function nonNullable<T>(): NonNullableMatcher {
  return createMatcher(
    (value): value is NonNullable<T> => value !== null && value !== undefined,
    () => "non-null defined value",
    () => `NonNullable`,
  );
}
