import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  mapOfSizeMatcher,
  type MapOfSize,
  type MapOfSizeMatcher,
} from "./map-size.type.js";

/**
 * Matcher for a Map with exactly the expected size.
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
