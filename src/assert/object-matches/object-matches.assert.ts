import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";

type FunctionLike = (...arguments_: never[]) => unknown;

type ObjectMatchLeaf =
  | FunctionLike
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>;

type DeepObjectMatch<T> = T extends ObjectMatchLeaf
  ? T
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: DeepObjectMatch<T[K]> }
    : T extends object
      ? { [K in keyof T]: DeepObjectMatch<T[K]> }
      : T;

/**
 * Assert that an object matches a partial deep object structure, with
 * type-narrowing.
 *
 * Plain objects are matched partially and recursively. Arrays are matched by
 * length and by recursively matching each element in order. Primitive values and
 * non-plain objects are compared using Object.is.
 */
export function assertObjectMatches<
  TActual,
  const TExpected extends Record<PropertyKey, unknown>,
>(
  actual: TActual,
  expected: TExpected,
  message?: string,
): asserts actual is TActual & DeepObjectMatch<TExpected> {
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
