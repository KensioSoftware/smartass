import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeNumericMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar primitive type matchers could accidentally match the wrong conditional
 * branch.
 */
export const typeNumericMatcher = Symbol("smartass.typeNumericMatcher");

type Numeric = number | bigint;

/**
 * Type produced when an actual value is matched by typeNumeric().
 *
 * If the calling scope already knows number or bigint literal information,
 * preserve that overlap. Otherwise, fall back to the standalone matcher type:
 * number | bigint.
 */
export type TypeNumericMatch<TActual> = [
  Extract<NonNullable<TActual>, Numeric>,
] extends [never]
  ? Numeric
  : Extract<NonNullable<TActual>, Numeric>;

export type TypeNumericMatcher = AssertionMatcher<Numeric> & {
  readonly [typeNumericMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeNumericMatch<TActual>;
};
