import { createMatcher } from "../../match/match.js";
import {
  nonEmptyArrayMatcher,
  type NonEmptyArray,
  type NonEmptyArrayMatcher,
} from "./array-not-empty.type.js";

/**
 * Matcher for a non-empty array.
 */
export function nonEmptyArray(): NonEmptyArrayMatcher {
  return {
    ...createMatcher(
      (value): value is NonEmptyArray<unknown> =>
        Array.isArray(value) && value.length > 0,
      () => `non-empty array`,
      () => `[…]`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [nonEmptyArrayMatcher]: true,
  };
}
