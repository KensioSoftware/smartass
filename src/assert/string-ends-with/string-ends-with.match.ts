import { repr } from "../../describe/describe.js";
import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a string that ends with a given suffix.
 */
export function stringEndingWith<const T extends string>(
  suffix: T,
): AssertionMatcher<`${string}${T}`> {
  return createMatcher(
    (value): value is `${string}${T}` =>
      typeof value === "string" && value.endsWith(suffix),
    () => `string ending with ${repr(suffix)}`,
    () => `"*${suffix}"`,
  );
}
