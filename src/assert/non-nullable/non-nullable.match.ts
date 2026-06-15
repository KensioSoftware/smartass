import { createMatcher } from "../../match/match.js";
import type { NonNullableMatcher } from "./non-nullable.type.js";

/**
 * Matcher for a non-nullable value.
 */
export function nonNullable(): NonNullableMatcher {
  return createMatcher(
    (value): value is NonNullable<unknown> =>
      value !== null && value !== undefined,
    () => "non-null defined value",
    () => `NonNullable`,
  );
}
