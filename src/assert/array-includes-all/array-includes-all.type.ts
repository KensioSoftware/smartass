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

/**
 * Type produced when an actual value is matched by arrayIncludingAll().
 *
 * The leading tuple elements are type-level witnesses that the array includes
 * the required number of matching values. They do not claim those values are at
 * those runtime indexes. This keeps user-facing types readable while still
 * communicating the useful facts: the array has enough elements, and those
 * witness elements match the requested element type.
 *
 * When the calling scope already knows the actual value is an array, we
 * preserve its element type for the rest of the tuple. Otherwise, the rest is
 * unknown[].
 */
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
  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayIncludingAllMatch<TActual, T, N>;
};
