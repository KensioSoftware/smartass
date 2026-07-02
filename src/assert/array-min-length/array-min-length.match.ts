import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  arrayOfMinLengthMatcher,
  type ArrayOfMinLength,
  type ArrayOfMinLengthMatcher,
} from "./array-min-length.type.js";

/**
 * Matcher for an array with at least the expected minimum length.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { arrayOfMinLength, assertObjectMatches } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   items: ["a", "b", "c"],
 * };
 *
 * assertObjectMatches(value, {
 *   items: arrayOfMinLength(2),
 * });
 *
 * // value is now narrowed to an object with at least 2 items
 * // {
 * //   items: [unknown, unknown, ...unknown[]];
 * // }
 * ```
 */
export function arrayOfMinLength<const N extends number>(
  minLength: N,
): ArrayOfMinLengthMatcher<N> {
  return {
    ...createMatcher(
      (value): value is ArrayOfMinLength<unknown, N> =>
        Array.isArray(value) && value.length >= minLength,
      () => `array of at least ${repr(minLength)} elements`,
      () => `Array(>=${repr(minLength)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [arrayOfMinLengthMatcher]: minLength,
  };
}
