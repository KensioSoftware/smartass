import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeString } from "./type-string.match.js";

/**
 * Assert that a value is of type string, with type-narrowing.
 * @example
 * ```ts
 * import { assertTypeString } from "@kensio/smartass";
 *
 * const value: unknown = "Ada";
 *
 * assertTypeString(value);
 *
 * // value is now narrowed to string
 * ```
 */
export function assertTypeString(
  value: unknown,
  message = `Expected ${desc(value)} to be of type string.`,
): asserts value is string {
  const matcher = typeString();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
