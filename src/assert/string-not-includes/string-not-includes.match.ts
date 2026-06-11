import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";

/**
 * Matcher for a string that does not include a given substring.
 */
export function stringNotIncluding<const T extends string>(
  substring: T,
): AssertionMatcher<Exclude<string, `${string}${T}${string}`>> {
  return createMatcher(
    (value): value is Exclude<string, `${string}${T}${string}`> =>
      typeof value === "string" && !value.includes(substring),
    () => `string not including ${repr(substring)}`,
    () => `"✗${substring}✗"`,
  );
}
