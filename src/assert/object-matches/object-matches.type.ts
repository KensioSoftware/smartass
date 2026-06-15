import type {
  ArrayOfLengthMatch,
  ArrayOfLengthMatcher,
} from "../array-length/array-length.type.js";
import type {
  ObjectWithProperty,
  ObjectWithPropertyMatcher,
} from "../object-has-property/object-has-property.type.js";
import type {
  AssertionMatcher,
  RefinedMatch,
  refinement,
} from "../../match/match.js";
import type {
  ArrayOfMinLengthMatch,
  ArrayOfMinLengthMatcher,
} from "../array-min-length/array-min-length.type.js";
import type {
  ArrayIncludingAllMatch,
  ArrayIncludingAllMatcher,
} from "../array-includes-all/array-includes-all.type.js";
import type { InstanceOfMatcher } from "../instance-of/instance-of.type.js";
import type {
  ArrayIncludingMatch,
  ArrayIncludingMatcher,
} from "../array-includes/array-includes.type.js";

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

/**
 * Apply a matcher to an actual type within assertObjectMatches().
 *
 * The main design goal here is user-facing readability: narrowed types should
 * appear in IDE tooltips and compiler errors as straightforward TypeScript
 * types, e.g. ["beta", ...string[]] or [string, string], rather than as opaque
 * internal helper/intersection types.
 *
 * In principle, matchers expose a [refinement] hook describing how they refine
 * an existing actual type. In practice, TypeScript cannot always apply generic
 * refinement hooks precisely enough through conditional inference, so some
 * matchers have explicit branches here. Those branches should delegate to the
 * matcher module's exported semantic *Match type instead of duplicating the
 * refinement logic.
 */
type RefineMatcherResult<TActual, TExpected extends AssertionMatcher<unknown>> =
  TExpected extends ArrayIncludingMatcher<infer TElement>
    ? ArrayIncludingMatch<TActual, TElement>
    : TExpected extends ArrayIncludingAllMatcher<infer TElement, infer N>
      ? ArrayIncludingAllMatch<TActual, TElement, N>
      : TExpected extends ArrayOfLengthMatcher<infer N>
        ? ArrayOfLengthMatch<TActual, N>
        : TExpected extends ArrayOfMinLengthMatcher<infer N>
          ? ArrayOfMinLengthMatch<TActual, N>
          : TExpected extends {
                readonly [refinement]?: unknown;
              }
            ? RefinedMatch<TExpected, TActual>
            : TExpected extends ObjectWithPropertyMatcher<infer K>
              ? ObjectWithPropertyRefine<TActual, K>
              : TExpected extends AssertionMatcher<
                    readonly [unknown, ...unknown[]]
                  >
                ? [
                    ActualArrayElement<TActual>,
                    ...ActualArrayElement<TActual>[],
                  ]
                : TExpected extends AssertionMatcher<readonly unknown[]>
                  ? ActualArrayElement<TActual>[]
                  : TExpected extends InstanceOfMatcher<infer TInstance>
                    ? InstanceOfRefine<TActual, TInstance>
                    : RefinedMatch<TExpected, TActual>;

type MatcherRefine<TActual, TExpected> =
  TExpected extends AssertionMatcher<unknown>
    ? RefineMatcherResult<TActual, TExpected>
    : never;

export type AssertedRefine<TActual, TRefined> = TRefined extends TActual
  ? TRefined
  : TActual & TRefined;

export type DeepObjectRefine<TActual, TExpected> =
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
