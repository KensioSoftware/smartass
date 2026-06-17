import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the MapOfSizeMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const mapOfSizeMatcher = Symbol("smartass.mapOfSizeMatcher");

export type MapOfSize<TKey, TValue, N extends number> = Map<TKey, TValue> & {
  readonly size: N;
};

/**
 * Type produced when an actual value is matched by mapOfSize().
 *
 * When the calling scope already knows the actual value is a Map, preserve that
 * exact Map type and only refine its size property. Otherwise, fall back to a
 * generic Map with unknown keys and values.
 */
export type MapOfSizeMatch<TActual, N extends number> =
  NonNullable<TActual> extends Map<unknown, unknown>
    ? NonNullable<TActual> & {
        readonly size: N;
      }
    : MapOfSize<unknown, unknown, N>;

export type MapOfSizeMatcher<N extends number> = AssertionMatcher<
  MapOfSize<unknown, unknown, N>
> & {
  readonly [mapOfSizeMatcher]: N;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => MapOfSizeMatch<TActual, N>;
};
