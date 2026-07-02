import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that an array exactly equals the expected array, with type narrowing.
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
