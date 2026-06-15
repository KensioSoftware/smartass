import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the StringIncludingMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates can
 * otherwise accidentally satisfy each other's conditional branches.
 */
export const stringIncludingMatcher = Symbol("smartass.stringIncludingMatcher");

/**
 * Type produced when an actual value is matched by stringIncluding().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already has string
 * literal overlap with the requested substring, we preserve that overlap.
 * Otherwise, we fall back to a readable template-literal string type.
 */
export type StringIncludingMatch<TActual, TSubstring extends string> = [
  Extract<NonNullable<TActual>, `${string}${TSubstring}${string}`>,
] extends [never]
  ? `${string}${TSubstring}${string}`
  : Extract<NonNullable<TActual>, `${string}${TSubstring}${string}`>;

/**
 * Type produced when assertStringIncludes() narrows a value.
 *
 * Assertion functions must assert a type assignable to the asserted parameter's
 * original type. So unlike StringIncludingMatch, the no-overlap fallback keeps
 * the original actual string type in an intersection.
 */
export type StringIncludingAssertion<
  TActual extends string,
  TSubstring extends string,
> = [Extract<TActual, `${string}${TSubstring}${string}`>] extends [never]
  ? TActual & `${string}${TSubstring}${string}`
  : Extract<TActual, `${string}${TSubstring}${string}`>;

export type StringIncludingMatcher<TSubstring extends string> =
  AssertionMatcher<`${string}${TSubstring}${string}`> & {
    readonly [stringIncludingMatcher]: TSubstring;

    /**
     * Optional type-level hook used by compositional assertions such as
     * assertObjectMatches().
     *
     * This lets the matcher describe how it refines an existing actual type,
     * rather than only exposing the standalone matches() predicate type.
     */
    readonly [refinement]?: <TActual>(
      actual: TActual,
    ) => StringIncludingMatch<TActual, TSubstring>;
  };
