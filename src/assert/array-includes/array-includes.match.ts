import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import {
  arrayIncludingMatcher,
  type ArrayIncluding,
  type ArrayIncludingMatcher,
} from "./array-includes.type.js";

/**
 * Matcher for an array including a specific single element.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { arrayIncluding, assertObjectMatches } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   roles: ["admin", "editor"],
 * };
 *
 * assertObjectMatches(value, {
 *   roles: arrayIncluding("admin"),
 * });
 *
 * // value is now narrowed to an object with roles including "admin"
 * // {
 * //   roles: ["admin", ...unknown[]];
 * // }
 * ```
 */
export function arrayIncluding<const E>(element: E): ArrayIncludingMatcher<E> {
  return {
    ...createMatcher(
      (value): value is ArrayIncluding<E> =>
        Array.isArray(value) && value.includes(element),
      () => `array including ${desc(element)}`,
      () => `[…,${repr(element)},…]`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [arrayIncludingMatcher]: element,
  };
}
