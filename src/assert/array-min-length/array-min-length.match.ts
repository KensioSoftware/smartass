import { type AssertionMatcher, createMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";

export type ArrayOfMinLength<T, N extends number> = N extends 0
  ? T[]
  : N extends 1
    ? [T, ...T[]]
    : N extends 2
      ? [T, T, ...T[]]
      : N extends 3
        ? [T, T, T, ...T[]]
        : N extends 4
          ? [T, T, T, T, ...T[]]
          : N extends 5
            ? [T, T, T, T, T, ...T[]]
            : [T, T, T, T, T, ...T[]];

export type ArrayOfMinLengthMatcher<N extends number> = AssertionMatcher<
  ArrayOfMinLength<unknown, N>
>;

/**
 * Matcher for an array with at least the expected minimum length.
 */
export function arrayOfMinLength<const N extends number>(
  minLength: N,
): ArrayOfMinLengthMatcher<N> {
  return createMatcher(
    (value): value is ArrayOfMinLength<unknown, N> =>
      Array.isArray(value) && value.length >= minLength,
    () => `array of at least ${repr(minLength)} elements`,
    () => `Array(>=${repr(minLength)})`,
  );
}
