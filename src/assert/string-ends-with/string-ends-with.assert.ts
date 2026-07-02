import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringEndingWith } from "./string-ends-with.match.js";
import type { StringEndingWithAssertion } from "./string-ends-with.type.js";

export function assertStringEndsWith<
  TActual extends string,
  const TSuffix extends string,
>(
  value: TActual,
  suffix: TSuffix,
  message?: string,
): asserts value is StringEndingWithAssertion<TActual, TSuffix>;

export function assertStringEndsWith<const TSuffix extends string>(
  value: unknown,
  suffix: TSuffix,
  message?: string,
): asserts value is `${string}${TSuffix}`;

/**
 * Assert that a string ends with a given suffix, with type narrowing.
 * @example
 * ```ts
 * import { assertStringEndsWith } from "@kensio/smartass";
 *
 * const filename: string = "index.ts";
 *
 * assertStringEndsWith(filename, ".ts");
 *
 * // filename is now narrowed to a string ending with ".ts"
 * ```
 */
export function assertStringEndsWith(
  value: unknown,
  suffix: string,
  message?: string,
): void {
  const matcher = stringEndingWith(suffix);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to end with ${repr(suffix)}, but it did not.`,
      value,
      matcher.represent(),
    );
  }
}
