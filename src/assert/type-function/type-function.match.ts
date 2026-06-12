import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a function value.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function typeFunction(): AssertionMatcher<Function> {
  return createMatcher(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    (value): value is Function => typeof value === "function",
    () => "function",
    () => "Function()",
  );
}
