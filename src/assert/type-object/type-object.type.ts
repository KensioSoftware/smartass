import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeObjectMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar matcher types could accidentally match the wrong conditional branch.
 */
export const typeObjectMatcher = Symbol("smartass.typeObjectMatcher");

/**
 * Type produced when an actual value is matched by typeObject().
 *
 * If the calling scope already knows specific object shapes, arrays, or class
 * instances, preserve that overlap. Otherwise, fall back to the standalone
 * matcher type: object.
 *
 * Note that this intentionally follows JavaScript's runtime typeof behaviour:
 * arrays are objects, but functions are not matched by typeObject().
 */
export type TypeObjectMatch<TActual> = [
  Extract<NonNullable<TActual>, object>,
] extends [never]
  ? object
  : Extract<NonNullable<TActual>, object>;

export type TypeObjectMatcher = AssertionMatcher<object> & {
  readonly [typeObjectMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeObjectMatch<TActual>;
};
