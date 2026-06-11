import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringEndingWith } from "./string-ends-with.match.js";

/**
 * Assert that a string ends with a given suffix, with type narrowing.
 */
export function assertStringEndsWith<const T extends string>(
  value: string,
  suffix: T,
  message?: string,
): asserts value is `${string}${T}` {
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
