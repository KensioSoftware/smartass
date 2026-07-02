import { createMatcher } from "../../match/match.js";
import {
  instanceOfMatcher,
  type ClassConstructor,
  type InstanceOfMatcher,
} from "./instance-of.type.js";

/**
 * Matcher for a value being an instance of a given class.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, instanceOf } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   createdAt: new Date("2024-01-01"),
 * };
 *
 * assertObjectMatches(value, {
 *   createdAt: instanceOf(Date),
 * });
 *
 * // value is now narrowed to an object with a Date createdAt property
 * // {
 * //   createdAt: Date;
 * // }
 * ```
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
