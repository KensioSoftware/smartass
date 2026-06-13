import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the InstanceOfMatcher type.
 */
export const instanceOfMatcher = Symbol("smartass.instanceOfMatcher");

export type InstanceOfMatcher<T> = AssertionMatcher<T> & {
  readonly [instanceOfMatcher]: T;
};

/**
 * Matcher for a value being an instance of a given class.
 */
export function instanceOf<T>(
  classConstructor: abstract new (...args: never[]) => T,
): InstanceOfMatcher<T> {
  return {
    ...createMatcher(
      (value): value is T => value instanceof classConstructor,
      () => `instance of ${classConstructor.name}`,
      () => `${classConstructor.name}()`,
    ),
    [instanceOfMatcher]: undefined as T,
  };
}
