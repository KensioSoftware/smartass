import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

/**
 * Assert that an array includes all specified elements, with type narrowing.
 * Elements can appear in any order and do not need to be contiguous.
 * Repeated required elements must appear at least that many times.
 * @example
 * ```ts
 * import { assertArrayIncludesAll } from "@kensio/smartass"
 *
 * const value: unknown = ["admin", "editor", "admin"];
 *
 * assertArrayIncludesAll(value, ["admin", "editor"] as const);
 *
 * // value is now narrowed to an array including both required elements
 * // ["admin" | "editor", "admin" | "editor", ...unknown[]]
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
