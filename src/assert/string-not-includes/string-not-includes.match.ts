import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  stringNotIncludingMatcher,
  type StringNotIncludingMatcher,
} from "./string-not-includes.type.js";

/**
 * Matcher for a string that does not include a given substring.
 */
export function stringNotIncluding<const T extends string>(
  substring: T,
): StringNotIncludingMatcher<T> {
  return {
    ...createMatcher(
      (value): value is Exclude<string, `${string}${T}${string}`> =>
        typeof value === "string" && !value.includes(substring),
      () => `string not including ${repr(substring)}`,
      () => `"✗${substring}✗"`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [stringNotIncludingMatcher]: substring,
  };
}
