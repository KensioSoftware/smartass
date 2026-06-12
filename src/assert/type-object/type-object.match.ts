import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for an object value.
 */
export function typeObject(): AssertionMatcher<object> {
  return createMatcher(
    (value): value is object => typeof value === "object",
    () => "object",
    () => "Object()",
  );
}
