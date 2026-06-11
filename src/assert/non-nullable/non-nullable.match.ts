import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a non-nullable value.
 */
export function nonNullable<T>(): AssertionMatcher<NonNullable<T>> {
  return createMatcher(
    (value): value is NonNullable<T> => value !== null && value !== undefined,
    () => "non-null defined value",
    () => `NonNullable`,
  );
}
