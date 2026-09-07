import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the SetOfMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const setOfMatcher = Symbol("smartass.setOfMatcher");

/**
 * Type produced when an actual value is matched by setOf().
 *
 * The expected Set carries the member type, and a matching value holds exactly
 * those members, so the refinement takes the expected member type.
 *
 * A mutable Set keeps its mutable type. Anything else refines to a ReadonlySet,
 * which is assignable to a ReadonlySet property and to an unknown one.
 */
export type SetOfMatch<TActual, TMember> =
  NonNullable<TActual> extends Set<unknown>
    ? Set<TMember>
    : ReadonlySet<TMember>;

export type SetOfMatcher<TMember> = AssertionMatcher<ReadonlySet<TMember>> & {
  readonly [setOfMatcher]: ReadonlySet<TMember>;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => SetOfMatch<TActual, TMember>;
};
