import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeStringMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar primitive type matchers could accidentally match the wrong conditional
 * branch.
 */
export const typeStringMatcher = Symbol("smartass.typeStringMatcher");

/**
 * Type produced when an actual value is matched by typeString().
 *
 * If the calling scope already knows string literal information, preserve that
 * overlap. Otherwise, fall back to the standalone matcher type: string.
 */
export type TypeStringMatch<TActual> = [
  Extract<NonNullable<TActual>, string>,
] extends [never]
  ? string
  : Extract<NonNullable<TActual>, string>;

export type TypeStringMatcher = AssertionMatcher<string> & {
  readonly [typeStringMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeStringMatch<TActual>;
};
