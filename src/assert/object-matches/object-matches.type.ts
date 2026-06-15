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
import type {
  InstanceOfMatch,
  InstanceOfMatcher,
} from "../instance-of/instance-of.type.js";
import type {
  ArrayIncludingMatch,
  ArrayIncludingMatcher,
} from "../array-includes/array-includes.type.js";
import type {
  NonEmptyArrayMatch,
  NonEmptyArrayMatcher,
} from "../array-not-empty/array-not-empty.type.js";
import type { OneOfMatch, OneOfMatcher } from "../one-of/one-of.type.js";
import type {
  StringEndingWithMatch,
  StringEndingWithMatcher,
} from "../string-ends-with/string-ends-with.type.js";
import type {
  StringIncludingMatch,
  StringIncludingMatcher,
} from "../string-includes/string-includes.type.js";
import type {
  StringOfLengthMatch,
  StringOfLengthMatcher,
} from "../string-length/string-length.type.js";
import type {
  StringNotIncludingMatch,
  StringNotIncludingMatcher,
} from "../string-not-includes/string-not-includes.type.js";
import type {
  StringStartingWithMatch,
  StringStartingWithMatcher,
} from "../string-starts-with/string-starts-with.type.js";
import type {
  TypeBigIntMatch,
  TypeBigIntMatcher,
} from "../type-bigint/type-bigint.type.js";
import type {
  TypeBooleanMatch,
  TypeBooleanMatcher,
} from "../type-boolean/type-boolean.type.js";
import type {
  TypeFunctionMatch,
  TypeFunctionMatcher,
} from "../type-function/type-function.type.js";
import type {
  TypeNumberMatch,
  TypeNumberMatcher,
} from "../type-number/type-number.type.js";
import type {
  TypeNumericMatch,
  TypeNumericMatcher,
} from "../type-numeric/type-numeric.type.js";
import type {
  TypeObjectMatch,
  TypeObjectMatcher,
} from "../type-object/type-object.type.js";
import type {
  TypeStringMatch,
  TypeStringMatcher,
} from "../type-string/type-string.type.js";
import type {
  TypeSymbolMatch,
  TypeSymbolMatcher,
} from "../type-symbol/type-symbol.type.js";
import type {
  TypeTypedArrayMatch,
  TypeTypedArrayMatcher,
} from "../type-typed-array/type-typed-array.type.js";
import type { UuidV4Match, UuidV4Matcher } from "../uuid/uuid-v4.type.js";

type FunctionLike = (...arguments_: never[]) => unknown;

/**
 * Values that should be treated as terminal leaves during deep object matching.
 *
 * These are object-like values at runtime, but assertObjectMatches() should
 * compare/refine them as whole values rather than recursively walking their
 * properties.
 */
type ObjectMatchLeaf =
  | FunctionLike
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>;

/**
 * Read a property from the current actual type while matching an expected
 * shape.
 *
 * Missing properties and nullable parents are treated as unknown, so nested
 * matchers can still describe the type they establish.
 */
type ActualProperty<
  TActual,
  TKey extends PropertyKey,
> = TKey extends keyof NonNullable<TActual>
  ? NonNullable<TActual>[TKey]
  : unknown;

/**
 * Extract the element type from an array or tuple-like type.
 */
type ArrayElement<T> = T extends readonly (infer TElement)[]
  ? TElement
  : unknown;

/**
 * Extract the element type from the current actual value if it is array-like.
 *
 * Used by generic array matcher fallbacks so known element types, such as
 * string[], can be preserved during object matcher refinement.
 */
type ActualArrayElement<TActual> =
  NonNullable<TActual> extends readonly unknown[]
    ? ArrayElement<NonNullable<TActual>>
    : unknown;

/**
 * Refine an object to require a specific property.
 *
 * Existing properties keep their original type, while properties that were not
 * present on the actual type are introduced as unknown.
 */
type ObjectWithPropertyRefine<TActual, K extends PropertyKey> =
  NonNullable<TActual> extends object
    ? Omit<NonNullable<TActual>, K> &
        Required<Pick<NonNullable<TActual>, K & keyof NonNullable<TActual>>> &
        Record<Exclude<K, keyof NonNullable<TActual>>, unknown>
    : ObjectWithProperty<K>;

/**
 * Choose a candidate refinement when it matches, otherwise continue to a
 * fallback.
 *
 * The tuple wrapper prevents distributive conditional behavior over unions.
 */
type FirstMatch<TCandidate, TFallback> = [TCandidate] extends [never]
  ? TFallback
  : TCandidate;

/**
 * Explicit refinement branches for array-specific matchers.
 *
 * These delegate to each matcher module's semantic Match type so the resulting
 * user-facing types stay readable.
 */
type ArrayMatcherRefine<TActual, TExpected extends AssertionMatcher<unknown>> =
  TExpected extends ArrayIncludingMatcher<infer TElement>
    ? ArrayIncludingMatch<TActual, TElement>
    : TExpected extends ArrayIncludingAllMatcher<infer TElement, infer N>
      ? ArrayIncludingAllMatch<TActual, TElement, N>
      : TExpected extends ArrayOfLengthMatcher<infer N>
        ? ArrayOfLengthMatch<TActual, N>
        : TExpected extends ArrayOfMinLengthMatcher<infer N>
          ? ArrayOfMinLengthMatch<TActual, N>
          : TExpected extends NonEmptyArrayMatcher
            ? NonEmptyArrayMatch<TActual>
            : never;

/**
 * Explicit refinement branches for string-specific matchers.
 *
 * These preserve useful literal-union overlap where possible, while falling
 * back to readable template-literal or branded string types.
 */
type StringMatcherRefine<TActual, TExpected extends AssertionMatcher<unknown>> =
  TExpected extends StringEndingWithMatcher<infer TSuffix>
    ? StringEndingWithMatch<TActual, TSuffix>
    : TExpected extends StringIncludingMatcher<infer TSubstring>
      ? StringIncludingMatch<TActual, TSubstring>
      : TExpected extends StringNotIncludingMatcher<infer TSubstring>
        ? StringNotIncludingMatch<TActual, TSubstring>
        : TExpected extends StringStartingWithMatcher<infer TPrefix>
          ? StringStartingWithMatch<TActual, TPrefix>
          : TExpected extends StringOfLengthMatcher<infer N>
            ? StringOfLengthMatch<TActual, N>
            : never;

/**
 * Explicit refinement branches for primitive type matchers.
 *
 * Keeping these branches here avoids exposing broad internal intersections when
 * assertObjectMatches() narrows existing object properties.
 */
type TypeMatcherRefine<
  TActual,
  TExpected extends AssertionMatcher<unknown>,
> = TExpected extends TypeBigIntMatcher
  ? TypeBigIntMatch<TActual>
  : TExpected extends TypeBooleanMatcher
    ? TypeBooleanMatch<TActual>
    : TExpected extends TypeFunctionMatcher
      ? TypeFunctionMatch<TActual>
      : TExpected extends TypeNumberMatcher
        ? TypeNumberMatch<TActual>
        : TExpected extends TypeNumericMatcher
          ? TypeNumericMatch<TActual>
          : TExpected extends TypeObjectMatcher
            ? TypeObjectMatch<TActual>
            : TExpected extends TypeStringMatcher
              ? TypeStringMatch<TActual>
              : TExpected extends TypeSymbolMatcher
                ? TypeSymbolMatch<TActual>
                : TExpected extends TypeTypedArrayMatcher
                  ? TypeTypedArrayMatch<TActual>
                  : never;

/**
 * Explicit refinement branches for matchers that do not fit a larger family.
 */
type MiscMatcherRefine<TActual, TExpected extends AssertionMatcher<unknown>> =
  TExpected extends InstanceOfMatcher<infer TInstance>
    ? InstanceOfMatch<TActual, TInstance>
    : TExpected extends OneOfMatcher<infer TAllowed>
      ? OneOfMatch<TActual, TAllowed>
      : TExpected extends UuidV4Matcher
        ? UuidV4Match<TActual>
        : never;

/**
 * Run all explicit matcher refinements before trying generic fallbacks.
 *
 * Precedence matters: explicit semantic Match types produce cleaner public
 * types than the generic refinement hook in cases where TypeScript inference
 * struggles.
 */
type BuiltInMatcherRefine<
  TActual,
  TExpected extends AssertionMatcher<unknown>,
> = FirstMatch<
  ArrayMatcherRefine<TActual, TExpected>,
  FirstMatch<
    StringMatcherRefine<TActual, TExpected>,
    FirstMatch<
      TypeMatcherRefine<TActual, TExpected>,
      MiscMatcherRefine<TActual, TExpected>
    >
  >
>;

/**
 * Generic matcher refinements used when no explicit branch applies.
 *
 * This handles custom refinement hooks, property-presence matchers, broad array
 * matchers, and finally falls back to the generic RefinedMatch behavior.
 */
type FallbackMatcherRefine<
  TActual,
  TExpected extends AssertionMatcher<unknown>,
> = TExpected extends {
  readonly [refinement]?: unknown;
}
  ? RefinedMatch<TExpected, TActual>
  : TExpected extends ObjectWithPropertyMatcher<infer K>
    ? ObjectWithPropertyRefine<TActual, K>
    : TExpected extends AssertionMatcher<readonly [unknown, ...unknown[]]>
      ? [ActualArrayElement<TActual>, ...ActualArrayElement<TActual>[]]
      : TExpected extends AssertionMatcher<readonly unknown[]>
        ? ActualArrayElement<TActual>[]
        : RefinedMatch<TExpected, TActual>;

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
type RefineMatcherResult<
  TActual,
  TExpected extends AssertionMatcher<unknown>,
> = FirstMatch<
  BuiltInMatcherRefine<TActual, TExpected>,
  FallbackMatcherRefine<TActual, TExpected>
>;

/**
 * Refine an actual value with an expected matcher.
 *
 * Non-matcher expected values are rejected here; DeepObjectRefine handles those
 * separately as objects, arrays, leaves, or primitive values.
 */
type MatcherRefine<TActual, TExpected> =
  TExpected extends AssertionMatcher<unknown>
    ? RefineMatcherResult<TActual, TExpected>
    : never;

/**
 * Convert an internally refined type into a valid assertion target type.
 *
 * Assertion functions may only assert types assignable to the original
 * parameter, so unrelated refinements are kept as intersections with the actual
 * type.
 */
export type AssertedRefine<TActual, TRefined> = TRefined extends TActual
  ? TRefined
  : TActual & TRefined;

/**
 * Recursively refine an actual object type using an expected object-matcher
 * shape.
 *
 * Matchers are applied directly, leaves are treated as whole values,
 * arrays/tuples refine by index, objects refine by key, and primitive expected
 * values narrow via intersection.
 */
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
