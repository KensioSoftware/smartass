import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a value being an instance of a given class.
 */
export function instanceOf<T>(
  classConstructor: abstract new (...args: never[]) => T,
): AssertionMatcher<T> {
  return createMatcher(
    (value): value is T => value instanceof classConstructor,
    () => `instance of ${classConstructor.name}`,
    () => `${classConstructor.name}()`,
  );
}
