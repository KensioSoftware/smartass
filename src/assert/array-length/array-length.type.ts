import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the ArrayOfLengthMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const arrayOfLengthMatcher = Symbol("smartass.arrayOfLengthMatcher");

type ArrayElementOf<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

type ArrayMatchElement<TActual> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? unknown
  : ArrayElementOf<Extract<NonNullable<TActual>, readonly unknown[]>>;

export type ArrayOfLength<T, N extends number> = N extends 0
  ? []
  : N extends 1
    ? [T]
    : N extends 2
      ? [T, T]
      : N extends 3
        ? [T, T, T]
        : N extends 4
          ? [T, T, T, T]
          : N extends 5
            ? [T, T, T, T, T]
            : N extends 6
              ? [T, T, T, T, T, T]
              : N extends 7
                ? [T, T, T, T, T, T, T]
                : N extends 8
                  ? [T, T, T, T, T, T, T, T]
                  : N extends 9
                    ? [T, T, T, T, T, T, T, T, T]
                    : N extends 10
                      ? [T, T, T, T, T, T, T, T, T, T]
                      : [T, T, T, T, T, T, T, T, T, T, ...T[]] & {
                          length: N;
                        };

export type ReadonlyArrayOfLength<T, N extends number> = Readonly<
  ArrayOfLength<T, N>
>;

type IsKnownReadonlyArray<TActual> =
  NonNullable<TActual> extends readonly unknown[]
    ? NonNullable<TActual> extends unknown[]
      ? false
      : true
    : false;

type ArrayOfLengthMatchForMutability<TActual, TElement, N extends number> =
  IsKnownReadonlyArray<TActual> extends true
    ? ReadonlyArrayOfLength<TElement, N>
    : ArrayOfLength<TElement, N>;

/**
 * Type produced when an actual value is matched by arrayOfLength().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already knows the
 * actual value is an array, we preserve its element type. Otherwise, we fall
 * back to unknown elements.
 */
export type ArrayOfLengthMatch<
  TActual,
  N extends number,
> = ArrayOfLengthMatchForMutability<TActual, ArrayMatchElement<TActual>, N>;

export type ArrayOfLengthMatcher<N extends number> = AssertionMatcher<
  ArrayOfLength<unknown, N>
> & {
  readonly [arrayOfLengthMatcher]: N;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayOfLengthMatch<TActual, N>;
};
