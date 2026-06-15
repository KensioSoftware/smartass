import type { AssertionMatcher, refinement } from "../../match/match.js";

export type ArrayIncludingAllElement<E extends readonly unknown[]> =
  E[number] extends never ? unknown : E[number];

export type ArrayElement<TArray extends readonly unknown[]> = TArray[number];

type ArrayElementOf<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

type MatchingArrayElement<TActualElement, TElement> = [
  Extract<TActualElement, TElement>,
] extends [never]
  ? TElement
  : Extract<TActualElement, TElement>;

type ArrayIncludingAllWitness<
  TElement,
  N extends number,
  TRestElement,
> = N extends 0
  ? TRestElement[]
  : N extends 1
    ? [TElement, ...TRestElement[]]
    : N extends 2
      ? [TElement, TElement, ...TRestElement[]]
      : N extends 3
        ? [TElement, TElement, TElement, ...TRestElement[]]
        : N extends 4
          ? [TElement, TElement, TElement, TElement, ...TRestElement[]]
          : N extends 5
            ? [
                TElement,
                TElement,
                TElement,
                TElement,
                TElement,
                ...TRestElement[],
              ]
            : [
                TElement,
                TElement,
                TElement,
                TElement,
                TElement,
                ...TRestElement[],
              ];

export type ArrayIncludingAll<T, N extends number> = N extends 0
  ? T[]
  : N extends 1
    ? [T, ...T[]]
    : N extends 2
      ? [T, T, ...T[]]
      : N extends 3
        ? [T, T, T, ...T[]]
        : N extends 4
          ? [T, T, T, T, ...T[]]
          : N extends 5
            ? [T, T, T, T, T, ...T[]]
            : [T, T, T, T, T, ...T[]];

export type ArrayIncludingAllMatch<TActual, TElement, N extends number> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? ArrayIncludingAllWitness<TElement, N, unknown>
  : ArrayIncludingAllWitness<
      MatchingArrayElement<
        ArrayElementOf<Extract<NonNullable<TActual>, readonly unknown[]>>,
        TElement
      >,
      N,
      ArrayElementOf<Extract<NonNullable<TActual>, readonly unknown[]>>
    >;

export type ArrayIncludingAllMatcher<
  T = unknown,
  N extends number = number,
> = AssertionMatcher<ArrayIncludingAll<T, N>> & {
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayIncludingAllMatch<TActual, T, N>;
};
