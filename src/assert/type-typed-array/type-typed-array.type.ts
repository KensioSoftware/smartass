import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the TypeTypedArrayMatcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar object matchers could accidentally match the wrong conditional branch.
 */
export const typeTypedArrayMatcher = Symbol("smartass.typeTypedArrayMatcher");

/**
 * Union type of all TypedArray types
 */
export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/**
 * Type produced when an actual value is matched by typeTypedArray().
 *
 * If the calling scope already knows specific TypedArray variants, preserve that
 * overlap. Otherwise, fall back to the standalone matcher type: TypedArray.
 */
export type TypeTypedArrayMatch<TActual> = [
  Extract<NonNullable<TActual>, TypedArray>,
] extends [never]
  ? TypedArray
  : Extract<NonNullable<TActual>, TypedArray>;

export type TypeTypedArrayMatcher = AssertionMatcher<TypedArray> & {
  readonly [typeTypedArrayMatcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => TypeTypedArrayMatch<TActual>;
};
