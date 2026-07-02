import { createMatcher } from "../../match/match.js";
import {
  typeSymbolMatcher,
  type TypeSymbolMatcher,
} from "./type-symbol.type.js";

/**
 * Matcher for a symbol value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeSymbol } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   key: Symbol("identifier"),
 * };
 *
 * assertObjectMatches(value, {
 *   key: typeSymbol(),
 * });
 *
 * // value is now narrowed to an object with a symbol key
 * // {
 * //   key: symbol;
 * // }
 * ```
 */
export function typeSymbol(): TypeSymbolMatcher {
  return {
    ...createMatcher(
      (value): value is symbol => typeof value === "symbol",
      () => "symbol",
      () => "Symbol()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeSymbolMatcher]: true,
  };
}
