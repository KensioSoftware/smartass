import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import type { TypedArray } from "./type-typed-array.type.js";

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
