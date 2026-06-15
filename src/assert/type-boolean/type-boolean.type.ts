import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeBooleanMatcher type.
 *
 * This keeps matcher dispatch nominal instead of relying only on structural
 * compatibility. That matters because many type matchers have very similar
 * shapes but different refinement semantics.
 */
export const typeBooleanMatcher = Symbol("smartass.typeBooleanMatcher");

/**
 * Type produced when an actual value is matched by typeBoolean().
 *
 * If the calling scope already knows a narrower boolean literal type, preserve
 * that overlap. Otherwise, fall back to the standalone matcher type: boolean.
 */
export type TypeBooleanMatch<TActual> = [
  Extract<NonNullable<TActual>, boolean>,
] extends [never]
  ? boolean
  : Extract<NonNullable<TActual>, boolean>;

export type TypeBooleanMatcher = AssertionMatcher<boolean> & {
  readonly [typeBooleanMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeBooleanMatch<TActual>;
};
