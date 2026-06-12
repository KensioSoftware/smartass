import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a boolean value.
 */
export function typeBoolean(): AssertionMatcher<boolean> {
  return createMatcher(
    (value): value is boolean => typeof value === "boolean",
    () => "boolean",
    () => "Boolean()",
  );
}
