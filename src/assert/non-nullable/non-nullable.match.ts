import { createMatcher } from "../../match/match.js";
import type { NonNullableMatcher } from "./non-nullable.type.js";

/**
 * Matcher for a non-nullable value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, nonNullable } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   userId: "abc123",
 * };
 *
 * assertObjectMatches(value, {
 *   userId: nonNullable(),
 * });
 *
 * // value is now narrowed to an object with a non-null, non-undefined userId
 * // {
 * //   userId: NonNullable<unknown>;
 * // }
 * ```
 */
export function nonNullable(): NonNullableMatcher {
  return createMatcher(
    (value): value is NonNullable<unknown> =>
      value !== null && value !== undefined,
    () => "non-null defined value",
    () => `NonNullable`,
  );
}
