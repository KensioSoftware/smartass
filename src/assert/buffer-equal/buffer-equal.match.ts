import { desc, repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import { assertTypeTypedArray } from "../type-typed-array/type-typed-array.assert.js";
import {
  bufferEqualToMatcher,
  type BufferEqualToMatcher,
} from "./buffer-equal.type.js";

import type { TypedArray } from "../type-typed-array/type-typed-array.type.js";

/**
 * Matcher for a TypedArray equal to an expected TypedArray, comparing byte by byte.
 */
export function bufferEqualTo<T extends TypedArray>(
  expected: T,
): BufferEqualToMatcher<T> {
  return {
    ...createMatcher(
      (value): value is T => {
        try {
          assertTypeTypedArray(value);
        } catch {
          return false;
        }

        if (value.constructor !== expected.constructor) {
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
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [bufferEqualToMatcher]: expected,
  };
}
