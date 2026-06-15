import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Type produced when an actual value is matched by typeBigInt().
 *
 * When the calling scope already has bigint literal information, we preserve
 * that overlap. Otherwise, we fall back to bigint.
 */
export type TypeBigIntMatch<TActual> = [
  Extract<NonNullable<TActual>, bigint>,
] extends [never]
  ? bigint
  : Extract<NonNullable<TActual>, bigint>;

export type TypeBigIntMatcher = AssertionMatcher<bigint> & {
  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeBigIntMatch<TActual>;
};
