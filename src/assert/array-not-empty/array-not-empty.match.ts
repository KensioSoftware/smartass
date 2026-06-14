import { createMatcher } from "../../match/match.js";
import type {
  NonEmptyArray,
  NonEmptyArrayMatcher,
} from "./array-not-empty.type.js";

/**
 * Matcher for a non-empty array.
 */
export function nonEmptyArray(): NonEmptyArrayMatcher {
  return createMatcher(
    (value): value is NonEmptyArray<unknown> =>
      Array.isArray(value) && value.length > 0,
    () => `non-empty array`,
    () => `[…]`,
  );
}
