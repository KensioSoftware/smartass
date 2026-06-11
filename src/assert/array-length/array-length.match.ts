import { createMatcher, type AssertionMatcher } from "../../match/match.js";
import { repr } from "../../describe/describe.js";

export type ArrayOfLength<T, N extends number> = N extends 0
  ? readonly []
  : N extends 1
    ? readonly [T]
    : N extends 2
      ? readonly [T, T]
      : N extends 3
        ? readonly [T, T, T]
        : N extends 4
          ? readonly [T, T, T, T]
          : N extends 5
            ? readonly [T, T, T, T, T]
            : N extends 6
              ? readonly [T, T, T, T, T, T]
              : N extends 7
                ? readonly [T, T, T, T, T, T, T]
                : N extends 8
                  ? readonly [T, T, T, T, T, T, T, T]
                  : N extends 9
                    ? readonly [T, T, T, T, T, T, T, T, T]
                    : N extends 10
                      ? readonly [T, T, T, T, T, T, T, T, T, T]
                      : readonly [T, T, T, T, T, T, T, T, T, T, ...T[]] & {
                          length: N;
                        };

/**
 * Matcher for an array with exactly the expected length.
 */
export function arrayOfLength<const N extends number>(
  expectedLength: N,
): AssertionMatcher<ArrayOfLength<unknown, N>> {
  return createMatcher(
    (value): value is ArrayOfLength<unknown, N> =>
      Array.isArray(value) && value.length === expectedLength,
    () => `array of length ${repr(expectedLength)}`,
    () => `Array(${repr(expectedLength)})`,
  );
}
