import { createMatcher } from "../../match/match.js";
import {
  nonEmptyStringMatcher,
  type NonEmptyString,
  type NonEmptyStringMatcher,
} from "./string-not-empty.type.js";

/**
 * Matcher for a non-empty string.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, nonEmptyString } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   sequenceNumber: "49590338271490256608559692538361571095921575989136588898",
 * };
 *
 * assertObjectMatches(value, {
 *   sequenceNumber: nonEmptyString(),
 * });
 *
 * // value is now narrowed to an object with a non-empty sequenceNumber
 * // {
 * //   sequenceNumber: string & { 0: string };
 * // }
 * ```
 */
export function nonEmptyString(): NonEmptyStringMatcher {
  return {
    ...createMatcher(
      (value): value is NonEmptyString =>
        typeof value === "string" && value.length > 0,
      () => `non-empty string`,
      () => `"…"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [nonEmptyStringMatcher]: true,
  };
}
