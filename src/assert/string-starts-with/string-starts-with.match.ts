import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringStartingWithMatcher,
  type StringStartingWithMatcher,
} from "./string-starts-with.type.js";

/**
 * Matcher for a string that starts with a given prefix.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, stringStartingWith } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   url: "https://example.com",
 * };
 *
 * assertObjectMatches(value, {
 *   url: stringStartingWith("https://"),
 * });
 *
 * // value is now narrowed to an object with a url starting with "https://"
 * // {
 * //   url: `https://${string}`;
 * // }
 * ```
 */
export function stringStartingWith<const T extends string>(
  prefix: T,
): StringStartingWithMatcher<T> {
  return {
    ...createMatcher(
      (value): value is `${T}${string}` =>
        typeof value === "string" && value.startsWith(prefix),
      () => `string starting with ${repr(prefix)}`,
      () => `"${prefix}…"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringStartingWithMatcher]: prefix,
  };
}
