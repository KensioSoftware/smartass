import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import {
  setNotIncludingMatcher,
  type SetNotIncludingMatcher,
} from "./set-not-includes.type.js";

/**
 * Matcher for a Set that does not hold a specific member.
 * Membership uses the Set's own has(), which is an identity match for objects,
 * so an equal-valued object held under another reference passes the check.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, setNotIncluding } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   tags: new Set(["draft", "featured"]),
 * };
 *
 * assertObjectMatches(value, {
 *   tags: setNotIncluding("archived"),
 * });
 *
 * // value is now narrowed to an object with a Set of tags
 * // {
 * //   tags: ReadonlySet<unknown>;
 * // }
 * ```
 */
export function setNotIncluding<const TMember>(
  member: TMember,
): SetNotIncludingMatcher<TMember> {
  return {
    ...createMatcher(
      (value): value is ReadonlySet<unknown> =>
        value instanceof Set && !value.has(member),
      () => `Set not including ${desc(member)}`,
      () => `Set([…,✗${repr(member)}✗,…])`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [setNotIncludingMatcher]: member,
  };
}
