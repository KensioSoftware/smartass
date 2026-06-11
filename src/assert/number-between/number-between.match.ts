import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Matcher for a numeric value between min and max inclusive.
 */
export function numberBetween(
  min: number | bigint,
  max: number | bigint,
): AssertionMatcher<number | bigint> {
  return createMatcher(
    (value): value is number | bigint => {
      if (typeof value !== "number" && typeof value !== "bigint") {
        return false;
      }
      return value >= min && value <= max;
    },
    () => `number between ${desc(min)} and ${desc(max)} inclusive`,
    () => `${repr(min)}<>${repr(max)}`,
  );
}
