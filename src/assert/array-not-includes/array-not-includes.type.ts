import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the arrayNotIncluding matcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const arrayNotIncludingMatcher = Symbol(
  "smartass.arrayNotIncludingMatcher",
);

type ArrayElement<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

/**
 * Type produced when an actual value is matched by arrayNotIncluding().
 *
 * Absence has no type-level witness. arrayIncluding() can put the element in a
 * leading tuple slot to record that it is there, and stringNotIncluding() can
 * exclude a template literal, but an array type cannot say that one particular
 * value is missing. Excluding the element type would also be wrong for an
 * identity match, where an array of the same element type can still hold no
 * reference to the element in hand.
 *
 * So the refinement establishes that the value is an array and stops there,
 * preserving the element type the calling scope already knows.
 */
export type ArrayNotIncludingMatch<TActual> = [
  Extract<NonNullable<TActual>, readonly unknown[]>,
] extends [never]
  ? unknown[]
  : ArrayElement<Extract<NonNullable<TActual>, readonly unknown[]>>[];

export type ArrayNotIncludingMatcher<T = unknown> = AssertionMatcher<
  unknown[]
> & {
  readonly [arrayNotIncludingMatcher]: T;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ArrayNotIncludingMatch<TActual>;
};
