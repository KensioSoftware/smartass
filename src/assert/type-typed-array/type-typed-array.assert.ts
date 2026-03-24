import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

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
 * Assert that a value is a TypedArray, with type-narrowing.
 * Supports all TypedArray types: Uint8Array, Int8Array, Uint16Array,
 * Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array,
 * BigInt64Array, BigUint64Array.
 */
export function assertTypeTypedArray(
  value: unknown,
  message = `Expected ${desc(value)} to be a TypedArray.`,
): asserts value is TypedArray {
  if (!ArrayBuffer.isView(value)) {
    throw new AssertionError(message, value, "TypedArray");
  }
}
