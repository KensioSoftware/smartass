import type { AssertionMatcher } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the InstanceOfMatcher type.
 */
export const instanceOfMatcher = Symbol("smartass.instanceOfMatcher");

export type InstanceOfMatcher<T> = AssertionMatcher<T> & {
  readonly [instanceOfMatcher]: T;
};
