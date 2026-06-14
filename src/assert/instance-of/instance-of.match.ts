import { createMatcher } from "../../match/match.js";
import {
  instanceOfMatcher,
  type InstanceOfMatcher,
} from "./instance-of.type.js";

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
