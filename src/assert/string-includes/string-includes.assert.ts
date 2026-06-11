import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringIncluding } from "./string-includes.match.js";

/**
 * Assert that a string includes a given substring, with type narrowing.
 */
export function assertStringIncludes<const T extends string>(
  value: string,
  substring: T,
  message?: string,
): asserts value is `${string}${T}${string}` {
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
