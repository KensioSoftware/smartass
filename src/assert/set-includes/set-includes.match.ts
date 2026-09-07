import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import {
  setIncludingMatcher,
  type SetIncludingMatcher,
} from "./set-includes.type.js";

/**
 * Matcher for a Set holding a specific member.
 * Membership uses the Set's own has(), which is an identity match for objects,
 * so an equal-valued object held under another reference fails the check.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, setIncluding } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   tags: new Set(["draft", "featured"]),
 * };
 *
 * assertObjectMatches(value, {
 *   tags: setIncluding("draft"),
 * });
 *
 * // value is now narrowed to an object with a Set of tags
 * // {
 * //   tags: ReadonlySet<"draft">;
 * // }
 * ```
 */
export function setIncluding<const TMember>(
  member: TMember,
): SetIncludingMatcher<TMember> {
  return {
    ...createMatcher(
      (value): value is ReadonlySet<TMember> =>
        value instanceof Set && value.has(member),
      () => `Set including ${desc(member)}`,
      () => `Set([…,${repr(member)},…])`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [setIncludingMatcher]: member,
  };
}
