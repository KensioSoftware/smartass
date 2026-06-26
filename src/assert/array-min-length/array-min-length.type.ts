import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the ArrayOfMinLengthMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const arrayOfMinLengthMatcher = Symbol(
  "smartass.arrayOfMinLengthMatcher",
);

type ArrayElementOf<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

type ArrayMatchElement<TActual> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? unknown
  : ArrayElementOf<Extract<NonNullable<TActual>, readonly unknown[]>>;

export type ArrayOfMinLength<T, N extends number> = N extends 0
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

export type ReadonlyArrayOfMinLength<T, N extends number> = Readonly<
  ArrayOfMinLength<T, N>
>;

type IsKnownReadonlyArray<TActual> =
  Extract<NonNullable<TActual>, readonly unknown[]> extends Extract<
    NonNullable<TActual>,
    unknown[]
  >
    ? false
    : true;

type ArrayOfMinLengthMatchForMutability<TActual, TElement, N extends number> =
  IsKnownReadonlyArray<TActual> extends true
    ? ReadonlyArrayOfMinLength<TElement, N>
    : ArrayOfMinLength<TElement, N>;

/**
 * Type produced when an actual value is matched by arrayOfMinLength().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already knows the
 * actual value is an array, we preserve its element type. Otherwise, we fall
 * back to unknown elements.
 */
export type ArrayOfMinLengthMatch<
  TActual,
  N extends number,
> = ArrayOfMinLengthMatchForMutability<TActual, ArrayMatchElement<TActual>, N>;

export type ArrayOfMinLengthMatcher<N extends number> = AssertionMatcher<
  ArrayOfMinLength<unknown, N>
> & {
  readonly [arrayOfMinLengthMatcher]: N;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayOfMinLengthMatch<TActual, N>;
};
