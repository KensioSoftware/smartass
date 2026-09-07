import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { dateAfter } from "./date-after.match.js";

/**
 * Assert that a Date holds a later instant than the expected one, with
 * type-narrowing.
 *
 * Comparing two instants through assertGreaterThan means reading epoch
 * milliseconds out of the failure. This reports both Dates in ISO form.
 * @example
 * ```ts
 * import { assertDateAfter } from "@kensio/smartass";
 *
 * const dueAt: unknown = new Date("2026-06-01T00:00:00.000Z");
 *
 * assertDateAfter(dueAt, new Date("2026-01-01T00:00:00.000Z"));
 *
 * // dueAt is now narrowed to Date
 * ```
 */
export function assertDateAfter(
  value: unknown,
  expected: Date,
  message?: string,
): asserts value is Date {
  const matcher = dateAfter(expected);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildDateAfterMessage(value, expected),
      value,
      matcher.represent(),
    );
  }
}

function buildDateAfterMessage(value: unknown, expected: Date): string {
  if (!(value instanceof Date)) {
    return `Expected ${desc(value)} to be a Date after ${repr(expected)}.`;
  }

  return `Expected ${repr(value)} to be after ${repr(expected)}.`;
}
