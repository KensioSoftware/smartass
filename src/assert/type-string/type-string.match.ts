import { createMatcher } from "../../match/match.js";
import {
  typeStringMatcher,
  type TypeStringMatcher,
} from "./type-string.type.js";

/**
 * Matcher for a string value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeString } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   name: "Alice",
 * };
 *
 * assertObjectMatches(value, {
 *   name: typeString(),
 * });
 *
 * // value is now narrowed to an object with a string name
 * // {
 * //   name: string;
 * // }
 * ```
 */
export function typeString(): TypeStringMatcher {
  return {
    ...createMatcher(
      (value): value is string => typeof value === "string",
      () => "string",
      () => "String()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeStringMatcher]: true,
  };
}
