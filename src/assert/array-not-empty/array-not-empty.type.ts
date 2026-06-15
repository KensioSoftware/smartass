import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the NonEmptyArrayMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const nonEmptyArrayMatcher = Symbol("smartass.nonEmptyArrayMatcher");

type ArrayElementOf<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

type ArrayMatchElement<TActual> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? unknown
  : ArrayElementOf<Extract<NonNullable<TActual>, readonly unknown[]>>;

export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Type produced when an actual value is matched by nonEmptyArray().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already knows the
 * actual value is an array, we preserve its element type. Otherwise, we fall
 * back to unknown elements.
 */
export type NonEmptyArrayMatch<TActual> = NonEmptyArray<
  ArrayMatchElement<TActual>
>;

export type NonEmptyArrayMatcher = AssertionMatcher<NonEmptyArray<unknown>> & {
  readonly [nonEmptyArrayMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => NonEmptyArrayMatch<TActual>;
};
