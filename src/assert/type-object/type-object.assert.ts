import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeObject } from "./type-object.match.js";

/**
 * Assert that a value is of type object, with type-narrowing.
 * @example
 * ```ts
 * import { assertTypeObject } from "@kensio/smartass";
 *
 * const value: unknown = { name: "Ada" };
 *
 * assertTypeObject(value);
 *
 * // value is now narrowed to object
 * ```
 */
export function assertTypeObject(
  value: unknown,
  message = `Expected ${desc(value)} to be of type object.`,
): asserts value is object {
  const matcher = typeObject();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
