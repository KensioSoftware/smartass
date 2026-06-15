import type { AssertionMatcher, refinement } from "../../match/match.js";

export type ArrayIncludingAllElement<E extends readonly unknown[]> =
  E[number] extends never ? unknown : E[number];

export type ArrayElement<TArray extends readonly unknown[]> = TArray[number];

type ArrayIncludingAllRefinement<TElement, N extends number, TActual> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? ArrayIncludingAll<TElement, N>
  : ArrayIncludingAll<
      Extract<NonNullable<TActual>, readonly unknown[]>[number],
      N
    >;

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

export type ArrayIncludingAllMatcher<
  T = unknown,
  N extends number = number,
> = AssertionMatcher<ArrayIncludingAll<T, N>> & {
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayIncludingAllRefinement<T, N, TActual>;
};
