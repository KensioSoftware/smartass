import { createMatcher } from "../../match/match.js";
import {
  typeFunctionMatcher,
  type TypeFunctionMatcher,
} from "./type-function.type.js";

/**
 * Matcher for a function value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeFunction } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   callback: () => "done",
 * };
 *
 * assertObjectMatches(value, {
 *   callback: typeFunction(),
 * });
 *
 * // value is now narrowed to an object with a function callback
 * // {
 * //   callback: Function;
 * // }
 * ```
 */
export function typeFunction(): TypeFunctionMatcher {
  return {
    ...createMatcher(
      (value): value is Function => typeof value === "function",
      () => "function",
      () => "Function()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeFunctionMatcher]: true,
  };
}
