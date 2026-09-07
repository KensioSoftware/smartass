import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { dateBefore } from "./date-before.match.js";

/**
 * Assert that a Date holds an earlier instant than the expected one, with
 * type-narrowing.
 *
 * Comparing two instants through assertLessThan means reading epoch
 * milliseconds out of the failure. This reports both Dates in ISO form.
 * @example
 * ```ts
 * import { assertDateBefore } from "@kensio/smartass";
 *
 * const createdAt: unknown = new Date("2026-01-01T00:00:00.000Z");
 *
 * assertDateBefore(createdAt, new Date("2026-06-01T00:00:00.000Z"));
 *
 * // createdAt is now narrowed to Date
 * ```
 */
export function assertDateBefore(
  value: unknown,
  expected: Date,
  message?: string,
): asserts value is Date {
  const matcher = dateBefore(expected);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildDateBeforeMessage(value, expected),
      value,
      matcher.represent(),
    );
  }
}

function buildDateBeforeMessage(value: unknown, expected: Date): string {
  if (!(value instanceof Date)) {
    return `Expected ${desc(value)} to be a Date before ${repr(expected)}.`;
  }

  return `Expected ${repr(value)} to be before ${repr(expected)}.`;
}
