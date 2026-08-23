import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringMatching } from "./string-matches.match.js";

/**
 * Assert that a string matches a regular expression, with type narrowing.
 * A regular expression carries no type-level shape, so this narrows an unknown
 * value to a string and stops there.
 * @example
 * ```ts
 * import { assertStringMatches } from "@kensio/smartass";
 *
 * const key: unknown = "2026/08/23/14/orders-1-2026-08-23-14-30-00-000";
 *
 * assertStringMatches(key, /^\d{4}\/\d{2}\/\d{2}\/\d{2}\//);
 *
 * // key is now narrowed to a string
 * ```
 */
export function assertStringMatches(
  value: unknown,
  pattern: RegExp,
  message?: string,
): asserts value is string {
  const matcher = stringMatching(pattern);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildStringMatchesMessage(value, pattern),
      value,
      matcher.represent(),
    );
  }
}

function buildStringMatchesMessage(value: unknown, pattern: RegExp): string {
  if (typeof value !== "string") {
    return `Expected ${desc(value)} to be a string matching ${repr(pattern)}.`;
  }

  return `Expected ${desc(value)} to match ${repr(pattern)}, but it did not.`;
}
