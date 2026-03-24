import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that a string starts with a given prefix, with type narrowing.
 */
export function assertStringStartsWith<const T extends string>(
  value: string,
  prefix: T,
  message?: string,
): asserts value is `${T}${string}` {
  if (!value.startsWith(prefix)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to start with ${repr(prefix)}, but it did not.`,
      value,
      `string starting with ${repr(prefix)}`,
    );
  }
}
