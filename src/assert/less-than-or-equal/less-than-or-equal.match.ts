import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Matcher for a numeric value less than or equal to the given value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, lessThanOrEqual } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   errorRate: 0,
 * };
 *
 * assertObjectMatches(value, {
 *   errorRate: lessThanOrEqual(0.01),
 * });
 *
 * // value is now narrowed to an object with a numeric error rate
 * // {
 * //   errorRate: number | bigint;
 * // }
 * ```
 */
export function lessThanOrEqual(
  expected: number | bigint,
): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint => {
      if (typeof value !== "number" && typeof value !== "bigint") {
        return false;
      }
      return value <= expected;
    },
    () => `number less than or equal to ${desc(expected)}`,
    () => `<=${repr(expected)}`,
  );
}
