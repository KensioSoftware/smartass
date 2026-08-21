import { arrayNotIncluding } from "./array-not-includes.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

export function assertArrayNotIncludes<
  TArray extends unknown[],
  const E extends TArray[number],
>(value: TArray, element: E, message?: string): asserts value is TArray;

export function assertArrayNotIncludes<const E>(
  value: unknown,
  element: E,
  message?: string,
): asserts value is unknown[];

/**
 * Assert that an array does not include a specific element, with type
 * narrowing.
 * Note that this is an identity match, so an object in an array only fails the
 * assertion by being a reference to the same object, rather than equivalent in
 * value to another object reference.
 * Note that absence has no type-level witness, so this narrows an unknown value
 * to an array and stops there.
 * @example
 * ```ts
 * import { assertArrayNotIncludes } from "@kensio/smartass"
 *
 * const value: unknown = ["editor", "viewer"];
 *
 * assertArrayNotIncludes(value, "admin");
 *
 * // value is now narrowed to an array
 * // unknown[]
 *
 * ```
 */
export function assertArrayNotIncludes(
  value: unknown,
  element: unknown,
  message?: string,
): void {
  const matcher = arrayNotIncluding(element);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildArrayNotIncludesMessage(value, element),
      value,
      matcher.represent(),
    );
  }
}

function buildArrayNotIncludesMessage(
  value: unknown,
  element: unknown,
): string {
  if (!Array.isArray(value)) {
    return `Expected ${desc(value)} to be an array not including ${desc(element)}.`;
  }

  return `Expected ${desc(value)} not to include ${desc(element)}, but it did.`;
}
