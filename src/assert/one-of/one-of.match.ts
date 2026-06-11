import { repr } from "../../describe/describe.js";
import { type AssertionMatcher, createMatcher } from "../../match/match.js";

/**
 * Matcher for a value that is one of a set of expected values.
 */
export function oneOf<const TAllowed extends readonly unknown[]>(
  allowed: TAllowed,
): AssertionMatcher<TAllowed[number]> {
  return createMatcher(
    (value): value is TAllowed[number] => allowed.includes(value as never),
    () => `one of ${repr(allowed)}`,
    () => allowed.map((i) => repr(i)).join("|"),
  );
}
