import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the SetNotIncludingMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const setNotIncludingMatcher = Symbol("smartass.setNotIncludingMatcher");

/**
 * Type produced when an actual value is matched by setNotIncluding().
 *
 * Absence has no type-level witness. Excluding the member type would also be
 * wrong for an identity match, where a Set of the same member type can still
 * hold no reference to the member in hand.
 *
 * So the refinement establishes that the value is a Set and stops there,
 * preserving the member type the calling scope already knows.
 */
export type SetNotIncludingMatch<TActual> = [
  Extract<NonNullable<TActual>, ReadonlySet<unknown>>,
] extends [never]
  ? ReadonlySet<unknown>
  : Extract<NonNullable<TActual>, ReadonlySet<unknown>>;

export type SetNotIncludingMatcher<TMember = unknown> = AssertionMatcher<
  ReadonlySet<unknown>
> & {
  readonly [setNotIncludingMatcher]: TMember;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => SetNotIncludingMatch<TActual>;
};
