import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  mapOfSizeMatcher,
  type MapOfSize,
  type MapOfSizeMatcher,
} from "./map-size.type.js";

/**
 * Matcher for a Map with exactly the expected size.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, mapOfSize } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   headers: new Map([["content-type", "application/json"]]),
 * };
 *
 * assertObjectMatches(value, {
 *   headers: mapOfSize(1),
 * });
 *
 * // value is now narrowed to an object with a Map of exactly 1 entry
 * // {
 * //   headers: Map<unknown, unknown> & { readonly size: 1 };
 * // }
 * ```
 */
export function mapOfSize<const N extends number>(
  expectedSize: N,
): MapOfSizeMatcher<N> {
  return {
    ...createMatcher(
      (value): value is MapOfSize<unknown, unknown, N> =>
        value instanceof Map && value.size === expectedSize,
      () => `Map of size ${repr(expectedSize)}`,
      () => `Map(${repr(expectedSize)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [mapOfSizeMatcher]: expectedSize,
  };
}
