import { createMatcher } from "../../match/match.js";
import type { TypeBigIntMatcher } from "./type-bigint.type.js";

/**
 * Matcher for a bigint value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeBigInt } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   largeId: 9007199254740993n,
 * };
 *
 * assertObjectMatches(value, {
 *   largeId: typeBigInt(),
 * });
 *
 * // value is now narrowed to an object with a bigint largeId
 * // {
 * //   largeId: bigint;
 * // }
 * ```
 */
export function typeBigInt(): TypeBigIntMatcher {
  return createMatcher(
    (value): value is bigint => typeof value === "bigint",
    () => "bigint",
    () => "BigInt()",
  );
}
