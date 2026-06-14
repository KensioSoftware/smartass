import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a symbol value.
 */
export function typeSymbol(): AssertionMatcher<symbol> {
  return createMatcher(
    (value): value is symbol => typeof value === "symbol",
    () => "symbol",
    () => "Symbol()",
  );
}
