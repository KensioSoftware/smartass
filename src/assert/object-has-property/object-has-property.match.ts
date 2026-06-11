import { desc, repr } from "../../describe/describe.js";
import { type AssertionMatcher, createMatcher } from "../../match/match.js";

export type ObjectWithProperty<K extends PropertyKey> = object &
  Record<K, unknown>;

/**
 * Matcher for an object with a certain named property.
 * The property only has to exist on the object, but could be undefined.
 */
export function objectWithProperty<K extends PropertyKey>(
  key: K,
): AssertionMatcher<ObjectWithProperty<K>> {
  return createMatcher(
    (value): value is ObjectWithProperty<K> =>
      typeof value === "object" && value !== null && key in value,
    () => `object with property ${desc(key)}`,
    () => `{${repr(key)}}`,
  );
}
