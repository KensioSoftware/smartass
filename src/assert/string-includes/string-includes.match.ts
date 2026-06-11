import { repr } from "../../describe/describe.js";
import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a string that includes a given substring.
 */
export function stringIncluding<const T extends string>(
  substring: T,
): AssertionMatcher<`${string}${T}${string}`> {
  return createMatcher(
    (value): value is `${string}${T}${string}` =>
      typeof value === "string" && value.includes(substring),
    () => `string including ${repr(substring)}`,
    () => `"*${substring}*"`,
  );
}
