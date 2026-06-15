import { createMatcher } from "../../match/match.js";
import {
  typeSymbolMatcher,
  type TypeSymbolMatcher,
} from "./type-symbol.type.js";

/**
 * Matcher for a symbol value.
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
