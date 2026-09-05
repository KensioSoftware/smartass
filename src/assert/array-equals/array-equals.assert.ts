import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";

/**
 * Assert that an array equals the expected array, with type narrowing.
 *
 * Members are compared by value. Plain objects and nested arrays are compared
 * recursively, and object keys must match exactly. Class instances and other
 * values are compared using Object.is. assertArrayIdentical() compares members
 * by identity.
 * @example
 * ```ts
 * import { assertArrayEquals } from "@kensio/smartass";
 *
 * const value: unknown = ["admin", "editor"];
 *
 * assertArrayEquals(value, ["admin", "editor"]);
 *
 * // value is now narrowed to ["admin", "editor"]
 * ```
 */
export function assertArrayEquals<const TExpected extends readonly unknown[]>(
  actual: unknown,
  expected: TExpected,
  message?: string,
): asserts actual is TExpected {
  const mismatch = findObjectComparisonMismatch(actual, expected, {
    exactObjectKeys: true,
    plainActualObjectsOnly: true,
  });

  if (mismatch !== undefined) {
    throw new AssertionError(
      message ??
        `Expected ${desc(actual)} to equal ${desc(expected)}. Mismatch at ${mismatch.path}: expected ${repr(mismatch.expected)}, got ${repr(mismatch.actual)}.`,
      actual,
      expected,
    );
  }
}
