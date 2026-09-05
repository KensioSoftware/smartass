import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that an array holds the same members as the expected array, compared
 * by identity, with type narrowing.
 *
 * The two arrays are compared by length and then member by member using
 * Object.is, so a member that is itself an array or an object has to be the
 * same reference on both sides. assertIdentical() compares a whole value with
 * ===, and assertArrayEquals() compares members by value.
 * @example
 * ```ts
 * import { assertArrayIdentical } from "@kensio/smartass";
 *
 * const admin = { name: "Ada" };
 * const value: unknown = [admin];
 *
 * assertArrayIdentical(value, [admin]);
 *
 * // value is now narrowed to [{ name: string }]
 * ```
 */
export function assertArrayIdentical<
  const TExpected extends readonly unknown[],
>(
  actual: unknown,
  expected: TExpected,
  message?: string,
): asserts actual is TExpected {
  if (!Array.isArray(actual) || !arraysIdentical(actual, expected)) {
    throw new AssertionError(
      message ??
        `Expected ${desc(actual)} to be identical to ${desc(expected)}.`,
      actual,
      expected,
    );
  }
}

function arraysIdentical(
  actual: readonly unknown[],
  expected: readonly unknown[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((element, index) => Object.is(element, expected[index]))
  );
}
