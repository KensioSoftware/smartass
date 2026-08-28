import { emptyArray } from "./array-empty.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import type { EmptyArray, EmptyArrayMatch } from "./array-empty.type.js";

export function assertArrayEmpty<TActual extends object | null | undefined>(
  value: TActual,
  message?: string,
): asserts value is Extract<NonNullable<TActual>, readonly unknown[]> &
  EmptyArrayMatch<Extract<NonNullable<TActual>, readonly unknown[]>>;

export function assertArrayEmpty(
  value: unknown,
  message?: string,
): asserts value is EmptyArray;

/**
 * Assert that an array has no elements, with type-narrowing.
 * The failure message names the elements that are present, which is usually
 * the diagnostic the assertion exists to produce.
 * @example
 * ```ts
 * import { assertArrayEmpty } from "@kensio/smartass";
 *
 * const value: unknown = [];
 *
 * assertArrayEmpty(value);
 *
 * // value is now narrowed to an empty array
 * ```
 */
export function assertArrayEmpty(value: unknown, message?: string): void {
  const matcher = emptyArray();

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildArrayEmptyMessage(value),
      value,
      matcher.represent(),
    );
  }
}

function buildArrayEmptyMessage(value: unknown): string {
  if (!Array.isArray(value)) {
    return `Expected ${desc(value)} to be an empty array.`;
  }

  return `Expected ${desc(value)} to be empty.`;
}
