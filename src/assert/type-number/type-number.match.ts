import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a number value.
 */
export function typeNumber(): AssertionMatcher<number> {
  return createMatcher(
    (value): value is number => typeof value === "number",
    () => "number",
    () => "Number()",
  );
}
