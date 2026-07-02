import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringEndingWithMatcher,
  type StringEndingWithMatcher,
} from "./string-ends-with.type.js";

/**
 * Matcher for a string that ends with a given suffix.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, stringEndingWith } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   filename: "report.pdf",
 * };
 *
 * assertObjectMatches(value, {
 *   filename: stringEndingWith(".pdf"),
 * });
 *
 * // value is now narrowed to an object with a filename ending in ".pdf"
 * // {
 * //   filename: `${string}.pdf`;
 * // }
 * ```
 */
export function stringEndingWith<const T extends string>(
  suffix: T,
): StringEndingWithMatcher<T> {
  return {
    ...createMatcher(
      (value): value is `${string}${T}` =>
        typeof value === "string" && value.endsWith(suffix),
      () => `string ending with ${repr(suffix)}`,
      () => `"…${suffix}"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringEndingWithMatcher]: suffix,
  };
}
