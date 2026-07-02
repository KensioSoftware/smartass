import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  stringOfLengthMatcher,
  type StringOfLength,
  type StringOfLengthMatcher,
} from "./string-length.type.js";

/**
 * Matcher for a string with exactly the expected length.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, stringOfLength } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   id: "user_123",
 * };
 *
 * assertObjectMatches(value, {
 *   id: stringOfLength(8),
 * });
 *
 * // value is now narrowed to an object with an 8-character id
 * // {
 * //   id: string & { length: 8; 0: string; ...; 7: string };
 * // }
 * ```
 */
export function stringOfLength<const N extends number>(
  expectedLength: N,
): StringOfLengthMatcher<N> {
  return {
    ...createMatcher(
      (value): value is StringOfLength<N> =>
        typeof value === "string" && value.length === expectedLength,
      () => `string of length ${repr(expectedLength)}`,
      () => `String(${repr(expectedLength)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringOfLengthMatcher]: expectedLength,
  };
}
