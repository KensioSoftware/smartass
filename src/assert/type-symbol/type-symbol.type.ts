import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeSymbolMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar primitive type matchers could accidentally match the wrong conditional
 * branch.
 */
export const typeSymbolMatcher = Symbol("smartass.typeSymbolMatcher");

/**
 * Type produced when an actual value is matched by typeSymbol().
 *
 * If the calling scope already knows unique symbol information, preserve that
 * overlap. Otherwise, fall back to the standalone matcher type: symbol.
 */
export type TypeSymbolMatch<TActual> = [
  Extract<NonNullable<TActual>, symbol>,
] extends [never]
  ? symbol
  : Extract<NonNullable<TActual>, symbol>;

export type TypeSymbolMatcher = AssertionMatcher<symbol> & {
  readonly [typeSymbolMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeSymbolMatch<TActual>;
};
