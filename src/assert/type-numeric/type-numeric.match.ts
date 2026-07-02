import { createMatcher } from "../../match/match.js";
import {
  typeNumericMatcher,
  type TypeNumericMatcher,
} from "./type-numeric.type.js";

/**
 * Matcher for a numeric value (number or bigint).
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeNumeric } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   amount: 100n,
 * };
 *
 * assertObjectMatches(value, {
 *   amount: typeNumeric(),
 * });
 *
 * // value is now narrowed to an object with a number or bigint amount
 * // {
 * //   amount: number | bigint;
 * // }
 * ```
 */
export function typeNumeric(): TypeNumericMatcher {
  return {
    ...createMatcher(
      (value): value is number | bigint =>
        typeof value === "number" || typeof value === "bigint",
      () => "numeric",
      () => "Number()|BigInt()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeNumericMatcher]: true,
  };
}
