import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeNumeric } from "./type-numeric.match.js";

/**
 * Assert that a value is numeric (number or bigint), with type-narrowing.
 * @example
 * ```ts
 * import { assertTypeNumeric } from "@kensio/smartass";
 *
 * const value: unknown = 42;
 *
 * assertTypeNumeric(value);
 *
 * // value is now narrowed to number | bigint
 * ```
 */
export function assertTypeNumeric(
  value: unknown,
  message = `Expected ${desc(value)} to be of type number or bigint.`,
): asserts value is number | bigint {
  const matcher = typeNumeric();
  if (!matcher.isMatch(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
