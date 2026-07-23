import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringStartingWith } from "./string-starts-with.match.js";
import type { StringStartingWithAssertion } from "./string-starts-with.type.js";

export function assertStringStartsWith<
  TActual extends string,
  const TPrefix extends string,
>(
  value: TActual,
  prefix: TPrefix,
  message?: string,
): asserts value is StringStartingWithAssertion<TActual, TPrefix>;

export function assertStringStartsWith<const TPrefix extends string>(
  value: unknown,
  prefix: TPrefix,
  message?: string,
): asserts value is `${TPrefix}${string}`;

/**
 * Assert that a string starts with a given prefix, with type narrowing.
 * @example
 * ```ts
 * import { assertStringStartsWith } from "@kensio/smartass";
 *
 * const url: string = "https://example.com";
 *
 * assertStringStartsWith(url, "https://");
 *
 * // url is now narrowed to a string starting with "https://"
 * ```
 */
export function assertStringStartsWith(
  value: unknown,
  prefix: string,
  message?: string,
): void {
  const matcher = stringStartingWith(prefix);
  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildStringStartsWithMessage(value, prefix),
      value,
      matcher.represent(),
    );
  }
}

function buildStringStartsWithMessage(value: unknown, prefix: string): string {
  if (typeof value !== "string") {
    return `Expected ${desc(value)} to be a string starting with ${repr(prefix)}.`;
  }

  return `Expected ${desc(value)} to start with ${repr(prefix)}, but it did not.`;
}
