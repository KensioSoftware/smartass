import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeNumberMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar primitive type matchers could accidentally match the wrong conditional
 * branch.
 */
export const typeNumberMatcher = Symbol("smartass.typeNumberMatcher");

/**
 * Type produced when an actual value is matched by typeNumber().
 *
 * If the calling scope already knows number literal information, preserve that
 * overlap. Otherwise, fall back to the standalone matcher type: number.
 */
export type TypeNumberMatch<TActual> = [
  Extract<NonNullable<TActual>, number>,
] extends [never]
  ? number
  : Extract<NonNullable<TActual>, number>;

export type TypeNumberMatcher = AssertionMatcher<number> & {
  readonly [typeNumberMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeNumberMatch<TActual>;
};
