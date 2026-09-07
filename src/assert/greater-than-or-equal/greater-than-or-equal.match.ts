import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Matcher for a numeric value greater than or equal to the given value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, greaterThanOrEqual } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   attempts: 1,
 * };
 *
 * assertObjectMatches(value, {
 *   attempts: greaterThanOrEqual(1),
 * });
 *
 * // value is now narrowed to an object with a numeric attempts count
 * // {
 * //   attempts: number | bigint;
 * // }
 * ```
 */
export function greaterThanOrEqual(
  expected: number | bigint,
): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint => {
      if (typeof value !== "number" && typeof value !== "bigint") {
        return false;
      }
      return value >= expected;
    },
    () => `number greater than or equal to ${desc(expected)}`,
    () => `>=${repr(expected)}`,
  );
}
