import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";

export type ArrayOfLength<T, N extends number> = N extends 0
  ? []
  : N extends 1
    ? [T]
    : N extends 2
      ? [T, T]
      : N extends 3
        ? [T, T, T]
        : N extends 4
          ? [T, T, T, T]
          : N extends 5
            ? [T, T, T, T, T]
            : N extends 6
              ? [T, T, T, T, T, T]
              : N extends 7
                ? [T, T, T, T, T, T, T]
                : N extends 8
                  ? [T, T, T, T, T, T, T, T]
                  : N extends 9
                    ? [T, T, T, T, T, T, T, T, T]
                    : N extends 10
                      ? [T, T, T, T, T, T, T, T, T, T]
                      : [T, T, T, T, T, T, T, T, T, T, ...T[]] & {
                          length: N;
                        };

export type ArrayOfLengthMatcher<N extends number> = AssertionMatcher<
  ArrayOfLength<unknown, N>
>;

/**
 * Matcher for an array with exactly the expected length.
 */
export function arrayOfLength<const N extends number>(
  expectedLength: N,
): ArrayOfLengthMatcher<N> {
  return createMatcher(
    (value): value is ArrayOfLength<unknown, N> =>
      Array.isArray(value) && value.length === expectedLength,
    () => `array of length ${repr(expectedLength)}`,
    () => `Array(${repr(expectedLength)})`,
  );
}
