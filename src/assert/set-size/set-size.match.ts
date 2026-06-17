import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  setOfSizeMatcher,
  type SetOfSize,
  type SetOfSizeMatcher,
} from "./set-size.type.js";

/**
 * Matcher for a Set with exactly the expected size.
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
