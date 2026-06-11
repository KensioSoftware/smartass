import { stringNotIncluding } from "./string-not-includes.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that a string does not include a given substring, with type narrowing.
 */
export function assertStringNotIncludes<const T extends string>(
  value: string,
  substring: T,
  message?: string,
): asserts value is Exclude<string, `${string}${T}${string}`> {
  const matcher = stringNotIncluding(substring);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} not to include ${repr(substring)}, but it did.`,
      value,
      matcher.represent(),
    );
  }
}
