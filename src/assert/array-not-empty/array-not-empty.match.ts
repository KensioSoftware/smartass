import { createMatcher } from "../../match/match.js";
import {
  nonEmptyArrayMatcher,
  type NonEmptyArray,
  type NonEmptyArrayMatcher,
} from "./array-not-empty.type.js";

/**
 * Matcher for a non-empty array.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, nonEmptyArray } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   tags: ["typescript", "testing"],
 * };
 *
 * assertObjectMatches(value, {
 *   tags: nonEmptyArray(),
 * });
 *
 * // value is now narrowed to an object with a non-empty tags array
 * // {
 * //   tags: [unknown, ...unknown[]];
 * // }
 * ```
 */
export function nonEmptyArray(): NonEmptyArrayMatcher {
  return {
    ...createMatcher(
      (value): value is NonEmptyArray<unknown> =>
        Array.isArray(value) && value.length > 0,
      () => `non-empty array`,
      () => `[…]`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [nonEmptyArrayMatcher]: true,
  };
}
