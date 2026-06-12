import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";
import type { AssertionMatcher, RefinedMatch } from "../../match/match.js";
import type {
  ArrayOfLength,
  ArrayOfLengthMatcher,
} from "../array-length/array-length.match.js";

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

type ActualProperty<
  TActual,
  TKey extends PropertyKey,
> = TKey extends keyof NonNullable<TActual>
  ? NonNullable<TActual>[TKey]
  : unknown;

type ArrayElement<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

type ArrayOfLengthRefine<TActual, N extends number> =
  NonNullable<TActual> extends readonly unknown[]
    ? TActual & ArrayOfLength<ArrayElement<NonNullable<TActual>>, N>
    : TActual & ArrayOfLength<unknown, N>;

type DeepObjectRefine<TActual, TExpected> =
  TExpected extends ArrayOfLengthMatcher<infer N>
    ? ArrayOfLengthRefine<TActual, N>
    : TExpected extends AssertionMatcher<unknown>
      ? RefinedMatch<TExpected, TActual>
      : TExpected extends ObjectMatchLeaf
        ? TActual & TExpected
        : TExpected extends readonly unknown[]
          ? TActual & {
              readonly [K in keyof TExpected]: DeepObjectRefine<
                ActualProperty<TActual, K>,
                TExpected[K]
              >;
            }
          : TExpected extends object
            ? TActual & {
                [K in keyof TExpected]: DeepObjectRefine<
                  ActualProperty<TActual, K>,
                  TExpected[K]
                >;
              }
            : TActual & TExpected;

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
): asserts actual is DeepObjectRefine<TActual, TExpected> {
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
