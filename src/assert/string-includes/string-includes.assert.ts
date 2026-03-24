import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that a string includes a given substring, with type narrowing.
 */
export function assertStringIncludes<const T extends string>(
  value: string,
  substring: T,
  message?: string,
): asserts value is `${string}${T}${string}` {
  if (!value.includes(substring)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to include ${repr(substring)}, but it did not.`,
      value,
      `... ${substring} ...`,
    );
  }
}
