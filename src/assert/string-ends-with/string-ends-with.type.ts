import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the StringEndingWithMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates can
 * otherwise accidentally satisfy each other's conditional branches.
 */
export const stringEndingWithMatcher = Symbol(
  "smartass.stringEndingWithMatcher",
);

/**
 * Type produced when an actual value is matched by stringEndingWith().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already has string
 * literal overlap with the requested suffix, we preserve that overlap.
 * Otherwise, we fall back to a readable template-literal string type.
 */
export type StringEndingWithMatch<TActual, TSuffix extends string> = [
  Extract<NonNullable<TActual>, `${string}${TSuffix}`>,
] extends [never]
  ? `${string}${TSuffix}`
  : Extract<NonNullable<TActual>, `${string}${TSuffix}`>;

/**
 * Type produced when assertStringEndsWith() narrows a value.
 *
 * Assertion functions must assert a type assignable to the asserted parameter's
 * original type. So unlike StringEndingWithMatch, the no-overlap fallback keeps
 * the original actual string type in an intersection.
 */
export type StringEndingWithAssertion<
  TActual extends string,
  TSuffix extends string,
> = [Extract<TActual, `${string}${TSuffix}`>] extends [never]
  ? TActual & `${string}${TSuffix}`
  : Extract<TActual, `${string}${TSuffix}`>;

export type StringEndingWithMatcher<TSuffix extends string> =
  AssertionMatcher<`${string}${TSuffix}`> & {
    readonly [stringEndingWithMatcher]: TSuffix;

    /**
     * Optional type-level hook used by compositional assertions such as
     * assertObjectMatches().
     *
     * This lets the matcher describe how it refines an existing actual type,
     * rather than only exposing the standalone matches() predicate type.
     */
    readonly [refinement]?: <TActual>(
      actual: TActual,
    ) => StringEndingWithMatch<TActual, TSuffix>;
  };
