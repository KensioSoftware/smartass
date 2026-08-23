import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringMatchingMatcher,
  type StringMatchingMatcher,
} from "./string-matches.type.js";

/**
 * Matcher for a string matching a regular expression.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * A regular expression carries no type-level shape, so the property is narrowed
 * to a string and no further.
 * @example
 * ```ts
 * import { assertObjectMatches, stringMatching } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   key: "2026/08/23/14/orders-1-2026-08-23-14-30-00-000",
 * };
 *
 * assertObjectMatches(value, {
 *   key: stringMatching(/^\d{4}\/\d{2}\/\d{2}\//),
 * });
 *
 * // value is now narrowed to an object with a string key
 * // {
 * //   key: string;
 * // }
 * ```
 */
export function stringMatching(pattern: RegExp): StringMatchingMatcher {
  return {
    ...createMatcher(
      (value): value is string =>
        typeof value === "string" && isMatching(value, pattern),
      () => `string matching ${repr(pattern)}`,
      () => repr(pattern),
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringMatchingMatcher]: pattern,
  };
}

/**
 * Test a pattern against a string, always from the start of the string.
 *
 * A global or sticky pattern carries lastIndex from one RegExp.test() call to
 * the next, so the same pattern asserted twice would alternate between passing
 * and failing. String.prototype.search() starts from the beginning of the string
 * every time and puts lastIndex back afterwards, leaving the caller's pattern as
 * it found it.
 */
function isMatching(value: string, pattern: RegExp): boolean {
  return value.search(pattern) !== -1;
}
