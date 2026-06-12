import { type AssertionMatcher, createMatcher } from "../../match/match.js";

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
 * Matcher for a TypedArray value.
 */
export function typeTypedArray(): AssertionMatcher<TypedArray> {
  return createMatcher(
    (value): value is TypedArray => ArrayBuffer.isView(value),
    () => "TypedArray",
    () => "TypedArray()",
  );
}
