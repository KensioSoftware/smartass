import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";
import type {
  AssertedRefine,
  DeepObjectRefine,
} from "./object-matches.type.js";

/**
 * Assert that an object matches a partial deep object structure, with
 * type-narrowing.
 *
 * Plain objects are matched partially and recursively.
 * Arrays are matched by length and by recursively matching each element in
 * order.
 * Matcher values are evaluated with their matcher predicate.
 * Primitive values and non-plain objects are compared using Object.is.
 */
export function assertObjectMatches<
  TActual,
  const TExpected extends Record<PropertyKey, unknown>,
>(
  actual: TActual,
  expected: TExpected,
  message?: string,
): asserts actual is AssertedRefine<
  TActual,
  DeepObjectRefine<TActual, TExpected>
> {
  const mismatch = findObjectComparisonMismatch(actual, expected, {
    exactObjectKeys: false,
    plainActualObjectsOnly: false,
  });

  if (mismatch !== undefined) {
    throw new AssertionError(
      message ??
        `Expected ${desc(actual)} to match ${desc(expected)}. Mismatch at ${mismatch.path}: expected ${repr(mismatch.expected)}, got ${repr(mismatch.actual)}.`,
      actual,
      expected,
    );
  }
}
