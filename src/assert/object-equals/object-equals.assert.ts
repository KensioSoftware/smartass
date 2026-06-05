import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";

/**
 * Assert that two objects have the same own keys and deeply equal values, with
 * type narrowing.
 *
 * Plain objects are compared recursively by value. Arrays are compared by length
 * and by recursively comparing each element in order. Primitive values and
 * non-plain objects are compared using Object.is.
 */
export function assertObjectEquals<
  const TExpected extends Record<PropertyKey, unknown>,
>(
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
