import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the InstanceOfMatcher type.
 */
export const instanceOfMatcher = Symbol("smartass.instanceOfMatcher");

export type ClassConstructor<T> = abstract new (...args: never[]) => T;

type InstanceOfRefinement<TActual, TInstance> = [
  Extract<NonNullable<TActual>, TInstance>,
] extends [never]
  ? TInstance
  : Extract<NonNullable<TActual>, TInstance>;

export type InstanceOfMatcher<T> = AssertionMatcher<T> & {
  readonly [instanceOfMatcher]: T;
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => InstanceOfRefinement<TActual, T>;
};
