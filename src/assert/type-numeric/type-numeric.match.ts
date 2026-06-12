import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a numeric value (number or bigint).
 */
export function typeNumeric(): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint =>
      typeof value === "number" || typeof value === "bigint",
    () => "numeric",
    () => "Number()|BigInt()",
  );
}
