import { nonEmptyString } from "./string-not-empty.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import type {
  NonEmptyString,
  NonEmptyStringAssertion,
} from "./string-not-empty.type.js";

export function assertStringNotEmpty<TActual extends string>(
  value: TActual,
  message?: string,
): asserts value is NonEmptyStringAssertion<TActual>;

export function assertStringNotEmpty(
  value: unknown,
  message?: string,
): asserts value is NonEmptyString;

/**
 * Assert that a string has at least one character, with type-narrowing.
 *
 * Note that this counts UTF-16 code units, not Unicode grapheme clusters.
 * @example
 * ```ts
 * import { assertStringNotEmpty } from "@kensio/smartass";
 *
 * const value: unknown = "admin";
 *
 * assertStringNotEmpty(value);
 *
 * // value is now narrowed to a non-empty string
 * ```
 */
export function assertStringNotEmpty(value: unknown, message?: string): void {
  const matcher = nonEmptyString();

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildStringNotEmptyMessage(value),
      value,
      matcher.represent(),
    );
  }
}

function buildStringNotEmptyMessage(value: unknown): string {
  if (typeof value !== "string") {
    return `Expected ${desc(value)} to be a non-empty string.`;
  }

  return `Expected string not to be empty, but it was empty.`;
}
