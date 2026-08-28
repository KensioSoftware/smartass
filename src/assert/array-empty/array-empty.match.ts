import { createMatcher } from "../../match/match.js";
import {
  emptyArrayMatcher,
  type EmptyArray,
  type EmptyArrayMatcher,
} from "./array-empty.type.js";

/**
 * Matcher for an empty array.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, emptyArray } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   errors: [],
 * };
 *
 * assertObjectMatches(value, {
 *   errors: emptyArray(),
 * });
 *
 * // value is now narrowed to an object with an empty errors array
 * // {
 * //   errors: [];
 * // }
 * ```
 */
export function emptyArray(): EmptyArrayMatcher {
  return {
    ...createMatcher(
      (value): value is EmptyArray =>
        Array.isArray(value) && value.length === 0,
      () => `empty array`,
      () => `[]`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [emptyArrayMatcher]: true,
  };
}
