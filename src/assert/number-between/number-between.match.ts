import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Matcher for a numeric value between min and max inclusive.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, numberBetween } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   score: 85,
 * };
 *
 * assertObjectMatches(value, {
 *   score: numberBetween(0, 100),
 * });
 *
 * // value is now narrowed to an object with a numeric score in range
 * // {
 * //   score: number | bigint;
 * // }
 * ```
 */
export function numberBetween(
  min: number | bigint,
  max: number | bigint,
): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint => {
      if (typeof value !== "number" && typeof value !== "bigint") {
        return false;
      }
      return value >= min && value <= max;
    },
    () => `number between ${desc(min)} and ${desc(max)} inclusive`,
    () => `${repr(min)}<>${repr(max)}`,
  );
}
