import { createMatcher } from "../../match/match.js";
import type { TypeBigIntMatcher } from "./type-bigint.type.js";

/**
 * Matcher for a bigint value.
 */
export function typeBigInt(): TypeBigIntMatcher {
  return createMatcher(
    (value): value is bigint => typeof value === "bigint",
    () => "bigint",
    () => "BigInt()",
  );
}
