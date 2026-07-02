import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  setOfSizeMatcher,
  type SetOfSize,
  type SetOfSizeMatcher,
} from "./set-size.type.js";

/**
 * Matcher for a Set with exactly the expected size.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, setOfSize } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   permissions: new Set(["read", "write"]),
 * };
 *
 * assertObjectMatches(value, {
 *   permissions: setOfSize(2),
 * });
 *
 * // value is now narrowed to an object with a Set of exactly 2 entries
 * // {
 * //   permissions: Set<unknown> & { readonly size: 2 };
 * // }
 * ```
 */
export function setOfSize<const N extends number>(
  expectedSize: N,
): SetOfSizeMatcher<N> {
  return {
    ...createMatcher(
      (value): value is SetOfSize<unknown, N> =>
        value instanceof Set && value.size === expectedSize,
      () => `Set of size ${repr(expectedSize)}`,
      () => `Set(${repr(expectedSize)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [setOfSizeMatcher]: expectedSize,
  };
}
