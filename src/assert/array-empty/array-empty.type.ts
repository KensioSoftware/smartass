import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the EmptyArrayMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const emptyArrayMatcher = Symbol("smartass.emptyArrayMatcher");

type ArrayBranchOf<TActual> = Extract<NonNullable<TActual>, readonly unknown[]>;

type ArrayMatchBranch<TActual> = [ArrayBranchOf<TActual>] extends [never]
  ? TActual
  : ArrayBranchOf<TActual>;

type IsKnownReadonlyArray<TActual> =
  NonNullable<TActual> extends readonly unknown[]
    ? NonNullable<TActual> extends unknown[]
      ? false
      : true
    : false;

export type EmptyArray = [];

export type ReadonlyEmptyArray = readonly [];

/**
 * Type produced when an actual value is matched by emptyArray().
 *
 * An empty tuple has no element type to preserve, so the only thing carried
 * over from the calling scope is whether the array is readonly.
 */
export type EmptyArrayMatch<TActual> =
  IsKnownReadonlyArray<ArrayMatchBranch<TActual>> extends true
    ? ReadonlyEmptyArray
    : EmptyArray;

export type EmptyArrayMatcher = AssertionMatcher<EmptyArray> & {
  readonly [emptyArrayMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => EmptyArrayMatch<TActual>;
};
