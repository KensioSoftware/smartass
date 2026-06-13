import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { findObjectComparisonMismatch } from "../../compare/object-comparison.js";
import type { AssertionMatcher, RefinedMatch } from "../../match/match.js";
import type {
  ObjectWithProperty,
  ObjectWithPropertyMatcher,
} from "../object-has-property/object-has-property.match.js";
import type {
  ArrayOfMinLength,
  ArrayOfMinLengthMatcher,
} from "../array-min-length/array-min-length.match.js";
import type {
  ArrayOfLength,
  ArrayOfLengthMatcher,
} from "../array-length/array-length.match.js";
import type {
  ArrayIncludingAll,
  ArrayIncludingAllMatcher,
} from "../array-includes-all/array-includes-all.match.js";
import type { InstanceOfMatcher } from "../instance-of/instance-of.match.js";

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

type ArrayOfLengthRefine<TActual, N extends number> = ArrayOfLength<
  ActualArrayElement<TActual>,
  N
>;

type ArrayOfMinLengthRefine<TActual, N extends number> = ArrayOfMinLength<
  ActualArrayElement<TActual>,
  N
>;

type ArrayIncludingAllRefine<TActual, N extends number> = ArrayIncludingAll<
  ActualArrayElement<TActual>,
  N
>;

type InstanceOfRefine<TActual, TInstance> = [
  Extract<NonNullable<TActual>, TInstance>,
] extends [never]
  ? TInstance
  : Extract<NonNullable<TActual>, TInstance>;

type ObjectWithPropertyRefine<TActual, K extends PropertyKey> =
  NonNullable<TActual> extends object
    ? Omit<NonNullable<TActual>, K> &
        Required<Pick<NonNullable<TActual>, K & keyof NonNullable<TActual>>> &
        Record<Exclude<K, keyof NonNullable<TActual>>, unknown>
    : ObjectWithProperty<K>;

type RefineMatcherResult<TActual, TExpected extends AssertionMatcher<unknown>> =
  TExpected extends ArrayOfLengthMatcher<infer N>
    ? ArrayOfLengthRefine<TActual, N>
    : TExpected extends ArrayOfMinLengthMatcher<infer N>
      ? ArrayOfMinLengthRefine<TActual, N>
      : TExpected extends ArrayIncludingAllMatcher<infer N>
        ? ArrayIncludingAllRefine<TActual, N>
        : TExpected extends ObjectWithPropertyMatcher<infer K>
          ? ObjectWithPropertyRefine<TActual, K>
          : TExpected extends AssertionMatcher<readonly [unknown, ...unknown[]]>
            ? [ActualArrayElement<TActual>, ...ActualArrayElement<TActual>[]]
            : TExpected extends AssertionMatcher<readonly unknown[]>
              ? ActualArrayElement<TActual>[]
              : TExpected extends InstanceOfMatcher<infer TInstance>
                ? InstanceOfRefine<TActual, TInstance>
                : RefinedMatch<TExpected, TActual>;

type MatcherRefine<TActual, TExpected> =
  TExpected extends AssertionMatcher<unknown>
    ? RefineMatcherResult<TActual, TExpected>
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
            -readonly [K in keyof TExpected]: DeepObjectRefine<
              ActualProperty<TActual, K>,
              TExpected[K]
            >;
          }
        : TExpected extends object
          ? Omit<NonNullable<TActual>, keyof TExpected> & {
              -readonly [K in keyof TExpected]: DeepObjectRefine<
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
