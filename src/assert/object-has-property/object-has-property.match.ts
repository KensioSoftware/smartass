import { desc, repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import type {
  ObjectWithProperty,
  ObjectWithPropertyMatcher,
} from "./object-has-property.type.js";

/**
 * Matcher for an object with a certain named property.
 * The property only has to exist on the object, but could be undefined.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, objectWithProperty } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   metadata: {
 *     requestId: "abc123",
 *   },
 * };
 *
 * assertObjectMatches(value, {
 *   metadata: objectWithProperty("requestId"),
 * });
 *
 * // value is now narrowed to an object with metadata.requestId present
 * // {
 * //   metadata: object & { requestId: unknown };
 * // }
 * ```
 */
export function objectWithProperty<K extends PropertyKey>(
  key: K,
): ObjectWithPropertyMatcher<K> {
  return createMatcher(
    (value): value is ObjectWithProperty<K> =>
      typeof value === "object" && value !== null && key in value,
    () => `object with property ${desc(key)}`,
    () => `{${repr(key)}}`,
  ) as ObjectWithPropertyMatcher<K>;
}
