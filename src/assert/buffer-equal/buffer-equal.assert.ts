import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import {
  assertTypeTypedArray,
  type TypedArray,
} from "../type-typed-array/type-typed-array.assert.js";

/**
 * Assert that two buffers (TypedArrays) are equal, comparing element by element.
 * Supports all TypedArray types: Uint8Array, Int8Array, Uint16Array, Int16Array,
 * Uint32Array, Int32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array.
 */
export function assertBufferEqual<T extends TypedArray>(
  actual: unknown,
  expected: T,
  message?: string,
): asserts actual is T {
  assertTypeTypedArray(actual);

  // Convert to Node.js Buffer for fast native comparison
  const actualBuffer = Buffer.from(
    actual.buffer,
    actual.byteOffset,
    actual.byteLength,
  );
  const expectedBuffer = Buffer.from(
    expected.buffer,
    expected.byteOffset,
    expected.byteLength,
  );

  if (Buffer.compare(actualBuffer, expectedBuffer) !== 0) {
    throw new AssertionError(
      message ?? `Expected ${desc(actual)} to equal ${desc(expected)}.`,
      actual,
      expected,
    );
  }
}
