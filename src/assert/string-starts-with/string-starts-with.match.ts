import { repr } from "../../describe/describe.js";
import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a string that starts with a given prefix.
 */
export function stringStartingWith<const T extends string>(
  prefix: T,
): AssertionMatcher<`${T}${string}`> {
  return createMatcher(
    (value): value is `${T}${string}` =>
      typeof value === "string" && value.startsWith(prefix),
    () => `string starting with ${repr(prefix)}`,
    () => `"${prefix}…"`,
  );
}
