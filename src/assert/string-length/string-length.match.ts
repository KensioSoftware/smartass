import { createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";
import type {
  StringOfLength,
  StringOfLengthMatcher,
} from "./string-length.type.js";

/**
 * Matcher for a string with exactly the expected length.
 */
export function stringOfLength<const N extends number>(
  expectedLength: N,
): StringOfLengthMatcher<N> {
  return createMatcher(
    (value): value is StringOfLength<N> =>
      typeof value === "string" && value.length === expectedLength,
    () => `string of length ${repr(expectedLength)}`,
    () => `String(${repr(expectedLength)})`,
  );
}
