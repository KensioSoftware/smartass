import type { AssertionMatcher, refinement } from "../../match/match.js";
import type { TypedArray } from "../type-typed-array/type-typed-array.type.js";

/**
 * Unique symbol to reliably identify the BufferEqualToMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const bufferEqualToMatcher = Symbol("smartass.bufferEqualToMatcher");

/**
 * Type produced when an actual value is matched by bufferEqualTo().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already has overlap
 * with the expected TypedArray type, we preserve that overlap. Otherwise, we
 * fall back to the expected TypedArray type.
 */
export type BufferEqualToMatch<TActual, TExpected extends TypedArray> = [
  Extract<NonNullable<TActual>, TExpected>,
] extends [never]
  ? TExpected
  : Extract<NonNullable<TActual>, TExpected>;

export type BufferEqualToMatcher<TExpected extends TypedArray> =
  AssertionMatcher<TExpected> & {
    readonly [bufferEqualToMatcher]: TExpected;

    /**
     * Optional type-level hook used by compositional assertions such as
     * assertObjectMatches().
     *
     * This lets the matcher describe how it refines an existing actual type,
     * rather than only exposing the standalone matches() predicate type.
     */
    readonly [refinement]?: <TActual>(
      actual: TActual,
    ) => BufferEqualToMatch<TActual, TExpected>;
  };
