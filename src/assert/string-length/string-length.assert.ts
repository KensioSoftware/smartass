import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringOfLength } from "./string-length.match.js";
import type {
  StringOfLength,
  StringOfLengthAssertion,
} from "./string-length.type.js";

export function assertStringLength<
  TActual extends string,
  const N extends number,
>(
  value: TActual,
  expectedLength: N,
  message?: string,
): asserts value is StringOfLengthAssertion<TActual, N>;

export function assertStringLength<const N extends number>(
  value: unknown,
  expectedLength: N,
  message?: string,
): asserts value is StringOfLength<N>;

/**
 * Assert that a string has exactly the expected length, with type narrowing.
 *
 * The type narrowing indicates:
 *  - An empty string for 0
 *  - An exact length and safe indexing of known character positions up to 10
 *  - For >10, an exact length and safe indexing of known character positions up
 *    to 10 when those positions are guaranteed to exist.
 *
 * Note that this models JavaScript string indexing and length (UTF-16 code units),
 * not Unicode grapheme clusters.
 * @example
 * ```ts
 * import { assertStringLength } from "@kensio/smartass";
 *
 * const code: string = "ABC123";
 *
 * assertStringLength(code, 6);
 *
 * // code is now narrowed to a string with exactly 6 code units
 * ```
 */
export function assertStringLength(
  value: unknown,
  expectedLength: number,
  message?: string,
): void {
  const matcher = stringOfLength(expectedLength);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildStringLengthMessage(value, expectedLength),
      value,
      matcher.represent(),
    );
  }
}

function buildStringLengthMessage(
  value: unknown,
  expectedLength: number,
): string {
  if (typeof value !== "string") {
    return `Expected ${desc(value)} to be a string of length ${repr(expectedLength)}.`;
  }

  return `Expected ${desc(value)} to have length ${repr(expectedLength)}, but it had length ${repr(value.length)}.`;
}
