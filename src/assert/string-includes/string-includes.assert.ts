import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringIncluding } from "./string-includes.match.js";
import type { StringIncludingAssertion } from "./string-includes.type.js";

export function assertStringIncludes<
  TActual extends string,
  const TSubstring extends string,
>(
  value: TActual,
  substring: TSubstring,
  message?: string,
): asserts value is StringIncludingAssertion<TActual, TSubstring>;

export function assertStringIncludes<const TSubstring extends string>(
  value: unknown,
  substring: TSubstring,
  message?: string,
): asserts value is `${string}${TSubstring}${string}`;

/**
 * Assert that a string includes a given substring, with type narrowing.
 */
export function assertStringIncludes(
  value: unknown,
  substring: string,
  message?: string,
): void {
  const matcher = stringIncluding(substring);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to include ${repr(substring)}, but it did not.`,
      value,
      matcher.represent(),
    );
  }
}
