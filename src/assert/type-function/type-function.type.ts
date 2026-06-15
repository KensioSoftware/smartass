import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeFunctionMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar matcher types could accidentally match the wrong conditional branch.
 */
export const typeFunctionMatcher = Symbol("smartass.typeFunctionMatcher");

/**
 * Type produced when an actual value is matched by typeFunction().
 *
 * If the calling scope already knows specific function signatures, preserve that
 * overlap. Otherwise, fall back to the standalone matcher type: Function.
 */

export type TypeFunctionMatch<TActual> = [
  Extract<NonNullable<TActual>, Function>,
] extends [never]
  ? Function
  : Extract<NonNullable<TActual>, Function>;

export type TypeFunctionMatcher = AssertionMatcher<Function> & {
  readonly [typeFunctionMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeFunctionMatch<TActual>;
};
