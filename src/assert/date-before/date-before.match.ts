import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";

/**
 * Matcher for a Date holding an instant earlier than the given one.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, dateBefore } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   createdAt: new Date("2026-01-01T00:00:00.000Z"),
 * };
 *
 * assertObjectMatches(value, {
 *   createdAt: dateBefore(new Date("2026-06-01T00:00:00.000Z")),
 * });
 *
 * // value is now narrowed to an object with a Date createdAt
 * // {
 * //   createdAt: Date;
 * // }
 * ```
 */
export function dateBefore(expected: Date): AssertionMatcher<Date> {
  return createMatcher(
    (value): value is Date =>
      value instanceof Date && value.getTime() < expected.getTime(),
    () => `date before ${repr(expected)}`,
    () => `<${repr(expected)}`,
  );
}
