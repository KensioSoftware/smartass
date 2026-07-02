import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  arrayOfLengthMatcher,
  type ArrayOfLength,
  type ArrayOfLengthMatcher,
} from "./array-length.type.js";

/**
 * Matcher for an array with exactly the expected length.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { arrayOfLength, assertObjectMatches } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   coordinates: [1.5, 2.5, 3.5],
 * };
 *
 * assertObjectMatches(value, {
 *   coordinates: arrayOfLength(3),
 * });
 *
 * // value is now narrowed to an object with a 3-element array
 * // {
 * //   coordinates: [unknown, unknown, unknown];
 * // }
 * ```
 */
export function arrayOfLength<const N extends number>(
  expectedLength: N,
): ArrayOfLengthMatcher<N> {
  return {
    ...createMatcher(
      (value): value is ArrayOfLength<unknown, N> =>
        Array.isArray(value) && value.length === expectedLength,
      () => `array of length ${repr(expectedLength)}`,
      () => `Array(${repr(expectedLength)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [arrayOfLengthMatcher]: expectedLength,
  };
}
