import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringNotIncludingMatcher,
  type StringNotIncludingMatcher,
} from "./string-not-includes.type.js";

/**
 * Matcher for a string that does not include a given substring.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, stringNotIncluding } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   content: "safe plain text",
 * };
 *
 * assertObjectMatches(value, {
 *   content: stringNotIncluding("<script>"),
 * });
 *
 * // value is now narrowed to an object with content not containing "<script>"
 * // {
 * //   content: Exclude<string, `${string}<script>${string}`>;
 * // }
 * ```
 */
export function stringNotIncluding<const T extends string>(
  substring: T,
): StringNotIncludingMatcher<T> {
  return {
    ...createMatcher(
      (value): value is Exclude<string, `${string}${T}${string}`> =>
        typeof value === "string" && !value.includes(substring),
      () => `string not including ${repr(substring)}`,
      () => `"✗${substring}✗"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringNotIncludingMatcher]: substring,
  };
}
