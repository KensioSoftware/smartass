import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringOfLength, type StringOfLength } from "./string-length.match.js";

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
 */
export function assertStringLength<const N extends number>(
  value: string,
  expectedLength: N,
  message?: string,
): asserts value is StringOfLength<N> {
  const matcher = stringOfLength(expectedLength);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to have length ${repr(expectedLength)}, but it had length ${repr(value.length)}.`,
      value,
      matcher.represent(),
    );
  }
}
