import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";

/**
 * Matcher for a Date holding an instant later than the given one.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, dateAfter } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   dueAt: new Date("2026-06-01T00:00:00.000Z"),
 * };
 *
 * assertObjectMatches(value, {
 *   dueAt: dateAfter(new Date("2026-01-01T00:00:00.000Z")),
 * });
 *
 * // value is now narrowed to an object with a Date dueAt
 * // {
 * //   dueAt: Date;
 * // }
 * ```
 */
export function dateAfter(expected: Date): AssertionMatcher<Date> {
  return createMatcher(
    (value): value is Date =>
      value instanceof Date && value.getTime() > expected.getTime(),
    () => `date after ${repr(expected)}`,
    () => `>${repr(expected)}`,
  );
}
