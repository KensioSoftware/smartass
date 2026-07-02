import { createMatcher } from "../../match/match.js";
import {
  typeNumberMatcher,
  type TypeNumberMatcher,
} from "./type-number.type.js";

/**
 * Matcher for a number value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeNumber } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   count: 42,
 * };
 *
 * assertObjectMatches(value, {
 *   count: typeNumber(),
 * });
 *
 * // value is now narrowed to an object with a numeric count
 * // {
 * //   count: number;
 * // }
 * ```
 */
export function typeNumber(): TypeNumberMatcher {
  return {
    ...createMatcher(
      (value): value is number => typeof value === "number",
      () => "number",
      () => "Number()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeNumberMatcher]: true,
  };
}
