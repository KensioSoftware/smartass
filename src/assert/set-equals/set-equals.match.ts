import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";
import { setOfMatcher, type SetOfMatcher } from "./set-equals.type.js";

/**
 * The comparison assertSetEquals() and setOf() both apply to Set members.
 *
 * It is the one assertObjectEquals() and assertArrayEquals() use, so a Set
 * member compares the same way whether it sits in a Set, an array or an object.
 */
export const setMemberComparison = {
  exactObjectKeys: true,
  plainActualObjectsOnly: true,
} as const;

/**
 * Matcher for a Set holding exactly the expected members.
 * Members are compared by value, the way assertArrayEquals compares members.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * @example
 * ```ts
 * import { assertObjectMatches, setOf } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   tags: new Set(["draft", "featured"]),
 * };
 *
 * assertObjectMatches(value, {
 *   tags: setOf(new Set(["draft", "featured"] as const)),
 * });
 *
 * // value is now narrowed to an object with a Set of those two members
 * // {
 * //   tags: ReadonlySet<"draft" | "featured">;
 * // }
 * ```
 */
export function setOf<TMember>(
  expected: ReadonlySet<TMember>,
): SetOfMatcher<TMember> {
  return {
    ...createMatcher(
      (value): value is ReadonlySet<TMember> =>
        findObjectComparisonMismatch(value, expected, setMemberComparison) ===
        undefined,
      () => `Set equal to ${desc(expected)}`,
      () => repr(expected),
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [setOfMatcher]: expected,
  };
}
