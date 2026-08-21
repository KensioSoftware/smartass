import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import {
  arrayNotIncludingMatcher,
  type ArrayNotIncludingMatcher,
} from "./array-not-includes.type.js";

/**
 * Matcher for an array that does not include a specific single element.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { arrayNotIncluding, assertObjectMatches } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   roles: ["editor", "viewer"],
 * };
 *
 * assertObjectMatches(value, {
 *   roles: arrayNotIncluding("admin"),
 * });
 *
 * // value is now narrowed to an object with an array of roles
 * // {
 * //   roles: unknown[];
 * // }
 * ```
 */
export function arrayNotIncluding<const E>(
  element: E,
): ArrayNotIncludingMatcher<E> {
  return {
    ...createMatcher(
      (value): value is unknown[] =>
        Array.isArray(value) && !value.includes(element),
      () => `array not including ${desc(element)}`,
      () => `[…,✗${repr(element)}✗,…]`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [arrayNotIncludingMatcher]: element,
  };
}
