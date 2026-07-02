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
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, bufferEqualTo } from "@kensio/smartass";
 *
 * const expected = new Uint8Array([0x01, 0x02, 0x03]);
 *
 * const value: unknown = {
 *   data: new Uint8Array([0x01, 0x02, 0x03]),
 * };
 *
 * assertObjectMatches(value, {
 *   data: bufferEqualTo(expected),
 * });
 *
 * // value is now narrowed to an object with data equal to the expected buffer
 * // {
 * //   data: Uint8Array;
 * // }
 * ```
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
