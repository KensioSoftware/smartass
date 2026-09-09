import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the NonEmptyStringMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const nonEmptyStringMatcher = Symbol("smartass.nonEmptyStringMatcher");

type NonEmptyStringBranch<TActual> = Exclude<
  Extract<NonNullable<TActual>, string>,
  ""
>;

/**
 * A string with at least one UTF-16 code unit.
 *
 * TypeScript has no built-in non-empty string type, so this models one the same
 * way StringOfLength does: a known character position. Under
 * noUncheckedIndexedAccess that makes value[0] a string rather than
 * string | undefined.
 */
export type NonEmptyString = string & { 0: string };

/**
 * Type produced when an actual value is matched by nonEmptyString().
 *
 * Where the calling scope already knows the string, its literal type is kept
 * and the empty string dropped from it, so a "" | "draft" property narrows to
 * "draft" rather than to an intersection that still admits "". A value with no
 * string in it at all falls back to the plain non-empty string type.
 */
export type NonEmptyStringMatch<TActual> = [
  NonEmptyStringBranch<TActual>,
] extends [never]
  ? NonEmptyString
  : NonEmptyStringBranch<TActual> & NonEmptyString;

/**
 * Type produced when assertStringNotEmpty() narrows a value.
 *
 * Assertion functions must assert a type assignable to the asserted parameter's
 * original type. So the no-overlap fallback keeps the original actual string
 * type in an intersection.
 */
export type NonEmptyStringAssertion<TActual extends string> = [
  NonEmptyStringBranch<TActual>,
] extends [never]
  ? TActual & NonEmptyString
  : NonEmptyStringBranch<TActual> & NonEmptyString;

export type NonEmptyStringMatcher = AssertionMatcher<NonEmptyString> & {
  readonly [nonEmptyStringMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => NonEmptyStringMatch<TActual>;
};
