import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Matcher for a numeric value greater than the given value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, greaterThan } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   score: 85,
 * };
 *
 * assertObjectMatches(value, {
 *   score: greaterThan(0),
 * });
 *
 * // value is now narrowed to an object with a positive numeric score
 * // {
 * //   score: number | bigint;
 * // }
 * ```
 */
export function greaterThan(
  expected: number | bigint,
): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint => {
      if (typeof value !== "number" && typeof value !== "bigint") {
        return false;
      }
      return value > expected;
    },
    () => `number greater than ${desc(expected)}`,
    () => `>${repr(expected)}`,
  );
}
