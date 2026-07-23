import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeFunction } from "./type-function.match.js";

/**
 * Assert that a value is of type function, with type-narrowing.
 * @example
 * ```ts
 * import { assertTypeFunction } from "@kensio/smartass";
 *
 * const callback: unknown = () => "ok";
 *
 * assertTypeFunction(callback);
 *
 * // callback is now narrowed to Function
 * ```
 */
export function assertTypeFunction(
  value: unknown,
  message = `Expected ${desc(value)} to be of type function.`,
): asserts value is Function {
  const matcher = typeFunction();
  if (!matcher.isMatch(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
