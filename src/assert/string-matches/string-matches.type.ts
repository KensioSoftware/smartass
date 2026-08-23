import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the StringMatchingMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates can
 * otherwise accidentally satisfy each other's conditional branches.
 */
export const stringMatchingMatcher = Symbol("smartass.stringMatchingMatcher");

/**
 * Type produced when an actual value is matched by stringMatching().
 *
 * A regular expression carries no type-level shape, so there is nothing to
 * narrow to beyond string. stringStartingWith() can put its prefix in a template
 * literal, but a pattern has no such witness, and the literals TypeScript would
 * have to test against are only known to the compiler as opaque strings.
 *
 * So the refinement establishes that the value is a string and stops there,
 * keeping any string literal information the calling scope already has.
 */
export type StringMatchingMatch<TActual> = [
  Extract<NonNullable<TActual>, string>,
] extends [never]
  ? string
  : Extract<NonNullable<TActual>, string>;

export type StringMatchingMatcher = AssertionMatcher<string> & {
  readonly [stringMatchingMatcher]: RegExp;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => StringMatchingMatch<TActual>;
};
