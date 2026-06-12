import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a string value.
 */
export function typeString(): AssertionMatcher<string> {
  return createMatcher(
    (value): value is string => typeof value === "string",
    () => "string",
    () => "String()",
  );
}
