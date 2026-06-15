import { createMatcher } from "../../match/match.js";
import {
  instanceOfMatcher,
  type ClassConstructor,
  type InstanceOfMatcher,
} from "./instance-of.type.js";

/**
 * Matcher for a value being an instance of a given class.
 */
export function instanceOf<T>(
  classConstructor: ClassConstructor<T>,
): InstanceOfMatcher<T> {
  return {
    ...createMatcher(
      (value): value is T => value instanceof classConstructor,
      () => `instance of ${classConstructor.name}`,
      () => `${classConstructor.name}()`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [instanceOfMatcher]: undefined as T,
  };
}
