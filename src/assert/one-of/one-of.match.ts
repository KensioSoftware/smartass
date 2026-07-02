import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import { oneOfMatcher, type OneOfMatcher } from "./one-of.type.js";

/**
 * Matcher for a value that is one of a set of expected values.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, oneOf } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   role: "admin",
 * };
 *
 * assertObjectMatches(value, {
 *   role: oneOf(["admin", "editor"] as const),
 * });
 *
 * // value is now narrowed to an object with a known role
 * // {
 * //   role: "admin" | "editor";
 * // }
 * ```
 */
export function oneOf<const TAllowed extends readonly unknown[]>(
  allowed: TAllowed,
): OneOfMatcher<TAllowed> {
  return {
    ...createMatcher(
      (value): value is TAllowed[number] => allowed.includes(value as never),
      () => `one of ${repr(allowed)}`,
      () => allowed.map((i) => repr(i)).join("|"),
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [oneOfMatcher]: allowed,
  };
}
