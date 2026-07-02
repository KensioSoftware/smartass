import { createMatcher } from "../../match/match.js";
import {
  typeBooleanMatcher,
  type TypeBooleanMatcher,
} from "./type-boolean.type.js";

/**
 * Matcher for a boolean value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeBoolean } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   active: true,
 * };
 *
 * assertObjectMatches(value, {
 *   active: typeBoolean(),
 * });
 *
 * // value is now narrowed to an object with a boolean active flag
 * // {
 * //   active: boolean;
 * // }
 * ```
 */
export function typeBoolean(): TypeBooleanMatcher {
  return {
    ...createMatcher(
      (value): value is boolean => typeof value === "boolean",
      () => "boolean",
      () => "Boolean()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeBooleanMatcher]: true,
  };
}
