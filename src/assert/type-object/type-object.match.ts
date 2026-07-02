import { createMatcher } from "../../match/match.js";
import {
  typeObjectMatcher,
  type TypeObjectMatcher,
} from "./type-object.type.js";

/**
 * Matcher for an object value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeObject } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   metadata: { source: "api" },
 * };
 *
 * assertObjectMatches(value, {
 *   metadata: typeObject(),
 * });
 *
 * // value is now narrowed to an object with an object metadata property
 * // {
 * //   metadata: object;
 * // }
 * ```
 */
export function typeObject(): TypeObjectMatcher {
  return {
    ...createMatcher(
      (value): value is object => typeof value === "object" && value !== null,
      () => "object",
      () => "Object()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeObjectMatcher]: true,
  };
}
