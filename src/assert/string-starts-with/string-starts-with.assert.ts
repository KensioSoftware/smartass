import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringStartingWith } from "./string-starts-with.match.js";

/**
 * Assert that a string starts with a given prefix, with type narrowing.
 */
export function assertStringStartsWith<const T extends string>(
  value: string,
  prefix: T,
  message?: string,
): asserts value is `${T}${string}` {
  const matcher = stringStartingWith(prefix);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to start with ${repr(prefix)}, but it did not.`,
      value,
      matcher.represent(),
    );
  }
}
