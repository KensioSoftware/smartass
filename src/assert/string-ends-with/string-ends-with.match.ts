import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringEndingWithMatcher,
  type StringEndingWithMatcher,
} from "./string-ends-with.type.js";

/**
 * Matcher for a string that ends with a given suffix.
 */
export function stringEndingWith<const T extends string>(
  suffix: T,
): StringEndingWithMatcher<T> {
  return {
    ...createMatcher(
      (value): value is `${string}${T}` =>
        typeof value === "string" && value.endsWith(suffix),
      () => `string ending with ${repr(suffix)}`,
      () => `"…${suffix}"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringEndingWithMatcher]: suffix,
  };
}
