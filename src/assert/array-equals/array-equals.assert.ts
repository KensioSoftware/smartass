import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that two arrays have the same length and the same elements in the same
 * positions, with type narrowing.
 *
 * Elements are compared using Object.is; nested arrays and objects must be the
 * same references.
 */
export function assertArrayEquals<const TExpected extends readonly unknown[]>(
  actual: unknown,
  expected: TExpected,
  message?: string,
): asserts actual is TExpected {
  if (!Array.isArray(actual) || !arraysEqual(actual, expected)) {
    throw new AssertionError(
      message ?? `Expected ${desc(actual)} to equal ${desc(expected)}.`,
      actual,
      expected,
    );
  }
}

function arraysEqual(
  actual: readonly unknown[],
  expected: readonly unknown[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((element, index) => Object.is(element, expected[index]))
  );
}
