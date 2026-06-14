import { desc, repr } from "../../describe/describe.js";
import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { assertTypeTypedArray } from "../type-typed-array/type-typed-array.assert.js";

import type { TypedArray } from "../type-typed-array/type-typed-array.type.js";

/**
 * Matcher for a TypedArray equal to an expected TypedArray, comparing byte by byte.
 */
export function bufferEqualTo<T extends TypedArray>(
  expected: T,
): AssertionMatcher<T> {
  return createMatcher(
    (value): value is T => {
      try {
        assertTypeTypedArray(value);
      } catch {
        return false;
      }

      const actualBuffer = Buffer.from(
        value.buffer,
        value.byteOffset,
        value.byteLength,
      );
      const expectedBuffer = Buffer.from(
        expected.buffer,
        expected.byteOffset,
        expected.byteLength,
      );

      return Buffer.compare(actualBuffer, expectedBuffer) === 0;
    },
    () => `buffer equal to ${desc(expected)}`,
    () => repr(expected),
  );
}
