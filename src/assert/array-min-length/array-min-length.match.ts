import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import {
  arrayOfMinLengthMatcher,
  type ArrayOfMinLength,
  type ArrayOfMinLengthMatcher,
} from "./array-min-length.type.js";

/**
 * Matcher for an array with at least the expected minimum length.
 */
export function arrayOfMinLength<const N extends number>(
  minLength: N,
): ArrayOfMinLengthMatcher<N> {
  return {
    ...createMatcher(
      (value): value is ArrayOfMinLength<unknown, N> =>
        Array.isArray(value) && value.length >= minLength,
      () => `array of at least ${repr(minLength)} elements`,
      () => `Array(>=${repr(minLength)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [arrayOfMinLengthMatcher]: minLength,
  };
}
