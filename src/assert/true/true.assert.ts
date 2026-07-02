import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that a value is strictly true (not just truthy), with type-narrowing
 * to the literal type `true`.
 * @example
 * ```ts
 * import { assertTrue } from "@kensio/smartass";
 *
 * const isEnabled: unknown = true;
 *
 * assertTrue(isEnabled);
 *
 * // isEnabled is now narrowed to true
 * ```
 */
export function assertTrue(
  value: unknown,
  message = `Expected ${desc(value)} to be boolean true.`,
): asserts value is true {
  if (value !== true) {
    throw new AssertionError(message, value, true);
  }
}
