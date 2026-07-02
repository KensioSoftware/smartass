import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringIncludingMatcher,
  type StringIncludingMatcher,
} from "./string-includes.type.js";

/**
 * Matcher for a string that includes a given substring.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, stringIncluding } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   message: "hello world",
 * };
 *
 * assertObjectMatches(value, {
 *   message: stringIncluding("world"),
 * });
 *
 * // value is now narrowed to an object with a message including "world"
 * // {
 * //   message: `${string}world${string}`;
 * // }
 * ```
 */
export function stringIncluding<const T extends string>(
  substring: T,
): StringIncludingMatcher<T> {
  return {
    ...createMatcher(
      (value): value is `${string}${T}${string}` =>
        typeof value === "string" && value.includes(substring),
      () => `string including ${repr(substring)}`,
      () => `"…${substring}…"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringIncludingMatcher]: substring,
  };
}
