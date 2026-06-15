import { createMatcher } from "../../match/match.js";
import {
  typeTypedArrayMatcher,
  type TypeTypedArrayMatcher,
  type TypedArray,
} from "./type-typed-array.type.js";

/**
 * Matcher for a TypedArray value.
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
