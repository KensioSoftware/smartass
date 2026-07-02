import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is strictly undefined, with type-narrowing to the
 * `undefined` type.
 * @example
 * ```ts
 * import { assertUndefined } from "@kensio/smartass";
 *
 * const value: unknown = undefined;
 *
 * assertUndefined(value);
 *
 * // value is now narrowed to undefined
 * ```
 */
export function assertUndefined(
  value: unknown,
  message = `Expected ${desc(value)} to be undefined.`,
): asserts value is undefined {
  if (value !== undefined) {
    throw new AssertionError(message, value, undefined);
  }
}
