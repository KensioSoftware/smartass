import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the OneOfMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const oneOfMatcher = Symbol("smartass.oneOfMatcher");

type OneOfElement<TAllowed extends readonly unknown[]> = TAllowed[number];

/**
 * Type produced when an actual value is matched by oneOf().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already has overlap
 * with the allowed values, we preserve that overlap. Otherwise, we fall back to
 * the allowed value union.
 */
export type OneOfMatch<TActual, TAllowed extends readonly unknown[]> = [
  Extract<TActual, OneOfElement<TAllowed>>,
] extends [never]
  ? OneOfElement<TAllowed>
  : Extract<TActual, OneOfElement<TAllowed>>;

export type OneOfMatcher<TAllowed extends readonly unknown[]> =
  AssertionMatcher<OneOfElement<TAllowed>> & {
    readonly [oneOfMatcher]: TAllowed;

    /**
     * Optional type-level hook used by compositional assertions such as
     * assertObjectMatches().
     *
     * This lets the matcher describe how it refines an existing actual type,
     * rather than only exposing the standalone matches() predicate type.
     */
    readonly [refinement]?: <TActual>(
      actual: TActual,
    ) => OneOfMatch<TActual, TAllowed>;
  };
