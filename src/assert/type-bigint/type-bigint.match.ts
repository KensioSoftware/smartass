import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a bigint value.
 */
export function typeBigInt(): AssertionMatcher<bigint> {
  return createMatcher(
    (value): value is bigint => typeof value === "bigint",
    () => "bigint",
    () => "BigInt()",
  );
}
