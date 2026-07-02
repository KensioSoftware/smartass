import { createMatcher } from "../../match/match.js";
import {
  typeTypedArrayMatcher,
  type TypeTypedArrayMatcher,
  type TypedArray,
} from "./type-typed-array.type.js";

/**
 * Matcher for a TypedArray value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, typeTypedArray } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   pixels: new Uint8Array([255, 128, 0]),
 * };
 *
 * assertObjectMatches(value, {
 *   pixels: typeTypedArray(),
 * });
 *
 * // value is now narrowed to an object with a TypedArray pixels property
 * // {
 * //   pixels: TypedArray;
 * // }
 * ```
 */
export function typeTypedArray(): TypeTypedArrayMatcher {
  return {
    ...createMatcher(
      (value): value is TypedArray =>
        ArrayBuffer.isView(value) && !(value instanceof DataView),
      () => "TypedArray",
      () => "TypedArray()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeTypedArrayMatcher]: true,
  };
}
