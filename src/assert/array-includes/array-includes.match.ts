import { createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";
import type {
  ArrayIncluding,
  ArrayIncludingMatcher,
} from "./array-includes.type.js";

/**
 * Matcher for an array including a specific single element.
 */
export function arrayIncluding<const E>(element: E): ArrayIncludingMatcher<E> {
  return createMatcher(
    (value): value is ArrayIncluding<E> =>
      Array.isArray(value) && value.includes(element),
    () => `array including ${desc(element)}`,
    () => `[…,${repr(element)},…]`,
  );
}
