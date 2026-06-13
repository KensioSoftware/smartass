import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";
import type { AssertionMatcher, RefinedMatch } from "../../match/match.js";
import type {
  ArrayIncluding,
  ArrayIncludingMatcher,
} from "../array-includes/array-includes.match.js";
import type {
  ArrayIncludingAll,
  ArrayIncludingAllMatcher,
} from "../array-includes-all/array-includes-all.match.js";
import type {
  ArrayOfLength,
  ArrayOfLengthMatcher,
} from "../array-length/array-length.match.js";
import type {
  ArrayOfMinLength,
  ArrayOfMinLengthMatcher,
} from "../array-min-length/array-min-length.match.js";
import type {
  NonEmptyArray,
  NonEmptyArrayMatcher,
} from "../array-not-empty/array-not-empty.match.js";
import type {
  ObjectWithProperty,
  ObjectWithPropertyMatcher,
} from "../object-has-property/object-has-property.match.js";

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

type ActualArrayElement<TActual> =
  NonNullable<TActual> extends readonly unknown[]
    ? ArrayElement<NonNullable<TActual>>
    : unknown;

type ArrayOfLengthRefine<TActual, N extends number> = TActual &
  ArrayOfLength<ActualArrayElement<TActual>, N>;

type ArrayOfMinLengthRefine<TActual, N extends number> = TActual &
  ArrayOfMinLength<ActualArrayElement<TActual>, N>;

type ArrayIncludingRefine<TActual, E> = Omit<NonNullable<TActual>, "includes"> &
  ArrayIncluding<ActualArrayElement<TActual> | E, E>;

type ArrayIncludingAllRefine<TActual, E extends readonly unknown[]> = Omit<
  NonNullable<TActual>,
  "includes"
> &
  ArrayIncludingAll<ActualArrayElement<TActual> | E[number], E>;

type NonEmptyArrayRefine<TActual> = TActual &
  NonEmptyArray<ActualArrayElement<TActual>>;

type ObjectWithPropertyRefine<
  TActual,
  K extends PropertyKey,
> = ObjectWithProperty<K, TActual>;

type MatcherRefine<TActual, TExpected> =
  TExpected extends ArrayOfLengthMatcher<infer N>
    ? ArrayOfLengthRefine<TActual, N>
    : TExpected extends ArrayOfMinLengthMatcher<infer N>
      ? ArrayOfMinLengthRefine<TActual, N>
      : TExpected extends NonEmptyArrayMatcher
        ? NonEmptyArrayRefine<TActual>
        : TExpected extends ArrayIncludingMatcher<infer E>
          ? ArrayIncludingRefine<TActual, E>
          : TExpected extends ArrayIncludingAllMatcher<infer E>
            ? ArrayIncludingAllRefine<TActual, E>
            : TExpected extends ObjectWithPropertyMatcher<infer K>
              ? ObjectWithPropertyRefine<TActual, K>
              : TExpected extends AssertionMatcher<unknown>
                ? RefinedMatch<TExpected, TActual>
                : never;

type AssertedRefine<TActual, TRefined> = TRefined extends TActual
  ? TRefined
  : TActual & TRefined;

type DeepObjectRefine<TActual, TExpected> =
  TExpected extends AssertionMatcher<unknown>
    ? MatcherRefine<TActual, TExpected>
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
          ? Omit<NonNullable<TActual>, keyof TExpected> & {
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
