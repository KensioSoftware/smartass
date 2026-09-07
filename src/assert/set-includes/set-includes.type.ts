import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the SetIncludingMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const setIncludingMatcher = Symbol("smartass.setIncludingMatcher");

/**
 * Type produced when an actual value is matched by setIncluding().
 *
 * arrayIncluding() records the required element in a leading tuple slot, as a
 * type-level witness that the array holds it. A Set has no positions, so it has
 * nowhere to keep such a witness.
 *
 * The refinement establishes that the value is a Set and stops there. Where the
 * calling scope already knows the Set type, that type is preserved, member type
 * and all.
 */
export type SetIncludingMatch<TActual, TMember> = [
  Extract<NonNullable<TActual>, ReadonlySet<unknown>>,
] extends [never]
  ? ReadonlySet<TMember>
  : Extract<NonNullable<TActual>, ReadonlySet<unknown>>;

export type SetIncludingMatcher<TMember = unknown> = AssertionMatcher<
  ReadonlySet<TMember>
> & {
  readonly [setIncludingMatcher]: TMember;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => SetIncludingMatch<TActual, TMember>;
};
