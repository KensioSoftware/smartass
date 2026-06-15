import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the ArrayIncludingMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const arrayIncludingMatcher = Symbol("smartass.arrayIncludingMatcher");

type ArrayElement<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

type MatchingArrayElement<TActualElement, TElement> = [
  Extract<TActualElement, TElement>,
] extends [never]
  ? TElement
  : Extract<TActualElement, TElement>;

export type ArrayIncluding<T> = [T, ...unknown[]];

/**
 * Type produced when an actual value is matched by arrayIncluding().
 *
 * The leading tuple element is a type-level witness that the array includes the
 * required value. It does not claim the value is at runtime index 0. This is a
 * deliberate tradeoff: TypeScript cannot cleanly express "appears somewhere in
 * the array", and this witness shape keeps user-facing types readable.
 *
 * When the calling scope already knows the actual value is an array, we
 * preserve its element type for the rest of the tuple. Otherwise, the rest is
 * unknown[].
 */
export type ArrayIncludingMatch<TActual, TElement> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? [TElement, ...unknown[]]
  : [
      MatchingArrayElement<
        ArrayElement<Extract<NonNullable<TActual>, readonly unknown[]>>,
        TElement
      >,
      ...ArrayElement<Extract<NonNullable<TActual>, readonly unknown[]>>[],
    ];

export type ArrayIncludingMatcher<T = unknown> = AssertionMatcher<
  ArrayIncluding<T>
> & {
  readonly [arrayIncludingMatcher]: T;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayIncludingMatch<TActual, T>;
};
