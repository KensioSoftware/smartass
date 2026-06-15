import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the StringStartingWithMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates can
 * otherwise accidentally satisfy each other's conditional branches.
 */
export const stringStartingWithMatcher = Symbol(
  "smartass.stringStartingWithMatcher",
);

/**
 * Type produced when an actual value is matched by stringStartingWith().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already has string
 * literal overlap with the requested prefix, we preserve that overlap.
 * Otherwise, we fall back to a readable template-literal string type.
 */
export type StringStartingWithMatch<TActual, TPrefix extends string> = [
  Extract<NonNullable<TActual>, `${TPrefix}${string}`>,
] extends [never]
  ? `${TPrefix}${string}`
  : Extract<NonNullable<TActual>, `${TPrefix}${string}`>;

/**
 * Type produced when assertStringStartsWith() narrows a value.
 *
 * Assertion functions must assert a type assignable to the asserted parameter's
 * original type. So unlike StringStartingWithMatch, the no-overlap fallback
 * keeps the original actual string type in an intersection.
 */
export type StringStartingWithAssertion<
  TActual extends string,
  TPrefix extends string,
> = [Extract<TActual, `${TPrefix}${string}`>] extends [never]
  ? TActual & `${TPrefix}${string}`
  : Extract<TActual, `${TPrefix}${string}`>;

export type StringStartingWithMatcher<TPrefix extends string> =
  AssertionMatcher<`${TPrefix}${string}`> & {
    readonly [stringStartingWithMatcher]: TPrefix;

    /**
     * Optional type-level hook used by compositional assertions such as
     * assertObjectMatches().
     *
     * This lets the matcher describe how it refines an existing actual type,
     * rather than only exposing the standalone matches() predicate type.
     */
    readonly [refinement]?: <TActual>(
      actual: TActual,
    ) => StringStartingWithMatch<TActual, TPrefix>;
  };
