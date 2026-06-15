import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  arrayOfLengthMatcher,
  type ArrayOfLength,
  type ArrayOfLengthMatcher,
} from "./array-length.type.js";

/**
 * Matcher for an array with exactly the expected length.
 */
export function arrayOfLength<const N extends number>(
  expectedLength: N,
): ArrayOfLengthMatcher<N> {
  return {
    ...createMatcher(
      (value): value is ArrayOfLength<unknown, N> =>
        Array.isArray(value) && value.length === expectedLength,
      () => `array of length ${repr(expectedLength)}`,
      () => `Array(${repr(expectedLength)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [arrayOfLengthMatcher]: expectedLength,
  };
}
