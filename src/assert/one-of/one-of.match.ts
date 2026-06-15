import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import { oneOfMatcher, type OneOfMatcher } from "./one-of.type.js";

/**
 * Matcher for a value that is one of a set of expected values.
 */
export function oneOf<const TAllowed extends readonly unknown[]>(
  allowed: TAllowed,
): OneOfMatcher<TAllowed> {
  return {
    ...createMatcher(
      (value): value is TAllowed[number] => allowed.includes(value as never),
      () => `one of ${repr(allowed)}`,
      () => allowed.map((i) => repr(i)).join("|"),
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [oneOfMatcher]: allowed,
  };
}
