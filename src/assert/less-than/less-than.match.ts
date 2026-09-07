import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Matcher for a numeric value less than the given value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, lessThan } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   retrievability: 0.42,
 * };
 *
 * assertObjectMatches(value, {
 *   retrievability: lessThan(1),
 * });
 *
 * // value is now narrowed to an object with a numeric retrievability
 * // {
 * //   retrievability: number | bigint;
 * // }
 * ```
 */
export function lessThan(
  expected: number | bigint,
): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint => {
      if (typeof value !== "number" && typeof value !== "bigint") {
        return false;
      }
      return value < expected;
    },
    () => `number less than ${desc(expected)}`,
    () => `<${repr(expected)}`,
  );
}
