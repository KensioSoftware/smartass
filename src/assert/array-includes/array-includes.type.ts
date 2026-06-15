import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the ArrayIncludingMatcher type.
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
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayIncludingMatch<TActual, T>;
};
