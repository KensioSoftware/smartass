import { nonEmptyArray } from "./array-not-empty.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import type { NonEmptyArray } from "./array-not-empty.type.js";

export function assertArrayNotEmpty<TArray extends unknown[]>(
  value: TArray,
  message?: string,
): asserts value is TArray & NonEmptyArray<TArray[number]>;

export function assertArrayNotEmpty(
  value: unknown,
  message?: string,
): asserts value is NonEmptyArray<unknown>;

/**
 * Assert that an array has at least one element, with type-narrowing.
 */
export function assertArrayNotEmpty(value: unknown, message?: string): void {
  if (!nonEmptyArray().matches(value)) {
    throw new AssertionError(
      message ?? buildArrayNotEmptyMessage(value),
      value,
      ["..."],
    );
  }
}

function buildArrayNotEmptyMessage(value: unknown): string {
  if (!Array.isArray(value)) {
    return `Expected ${desc(value)} to be a non-empty array.`;
  }

  return `Expected array not to be empty, but it was empty.`;
}
