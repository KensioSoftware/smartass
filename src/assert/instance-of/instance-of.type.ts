import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the InstanceOfMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const instanceOfMatcher = Symbol("smartass.instanceOfMatcher");

export type ClassConstructor<T> = abstract new (...args: never[]) => T;

/**
 * Type produced when an actual value is matched by instanceOf().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. When the calling scope already has overlap
 * with the expected instance type, we preserve that overlap. Otherwise, we fall
 * back to the expected instance type.
 */
export type InstanceOfMatch<TActual, TInstance> = [
  Extract<NonNullable<TActual>, TInstance>,
] extends [never]
  ? TInstance
  : Extract<NonNullable<TActual>, TInstance>;

/**
 * Type produced when assertInstanceOf() narrows a value.
 *
 * Assertion functions must assert a type assignable to the asserted parameter's
 * original type. So unlike InstanceOfMatch, the no-overlap fallback keeps the
 * original actual type in an intersection.
 */
export type InstanceOfAssertion<TActual, TInstance> = [
  Extract<NonNullable<TActual>, TInstance>,
] extends [never]
  ? TActual & TInstance
  : Extract<NonNullable<TActual>, TInstance>;

export type InstanceOfMatcher<T> = AssertionMatcher<T> & {
  readonly [instanceOfMatcher]: T;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => InstanceOfMatch<TActual, T>;
};
