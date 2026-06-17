import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the SetOfSizeMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const setOfSizeMatcher = Symbol("smartass.setOfSizeMatcher");

export type SetOfSize<TValue, N extends number> = Set<TValue> & {
  readonly size: N;
};

/**
 * Type produced when an actual value is matched by setOfSize().
 *
 * When the calling scope already knows the actual value is a Set, preserve that
 * exact Set type and only refine its size property. Otherwise, fall back to a
 * generic Set with unknown values.
 */
export type SetOfSizeMatch<TActual, N extends number> =
  NonNullable<TActual> extends Set<unknown>
    ? NonNullable<TActual> & {
        readonly size: N;
      }
    : SetOfSize<unknown, N>;

export type SetOfSizeMatcher<N extends number> = AssertionMatcher<
  SetOfSize<unknown, N>
> & {
  readonly [setOfSizeMatcher]: N;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => SetOfSizeMatch<TActual, N>;
};
