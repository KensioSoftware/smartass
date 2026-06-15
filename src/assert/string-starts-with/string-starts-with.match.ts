import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringStartingWithMatcher,
  type StringStartingWithMatcher,
} from "./string-starts-with.type.js";

/**
 * Matcher for a string that starts with a given prefix.
 */
export function stringStartingWith<const T extends string>(
  prefix: T,
): StringStartingWithMatcher<T> {
  return {
    ...createMatcher(
      (value): value is `${T}${string}` =>
        typeof value === "string" && value.startsWith(prefix),
      () => `string starting with ${repr(prefix)}`,
      () => `"${prefix}…"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringStartingWithMatcher]: prefix,
  };
}
