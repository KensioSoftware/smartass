import { AssertionError } from "../../assertion-error.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that two values differ under a deep comparison.
 *
 * Plain objects and arrays are compared recursively by value. Object keys must
 * match exactly. Class instances and other values are compared using Object.is.
 * @example
 * ```ts
 * import { assertNotEqual } from "@kensio/smartass";
 *
 * const before = "9f2c1a";
 * const after = "4b821d";
 *
 * assertNotEqual(before, after);
 * ```
 */
export function assertNotEqual(
  actual: unknown,
  unexpected: unknown,
  message?: string,
): void {
  const mismatch = findObjectComparisonMismatch(actual, unexpected, {
    exactObjectKeys: true,
    plainActualObjectsOnly: true,
  });

  if (mismatch === undefined) {
    throw new AssertionError(
      message ??
        `Expected ${desc(actual)} not to equal ${desc(unexpected)}, but it did.`,
      actual,
      unexpected,
    );
  }
}
