import {
  type AssertionMatcher,
  createMatcher,
  type refinement,
} from "../../match/match.js";
import { repr } from "../../describe/describe.js";

export type StringOfLength<N extends number> = N extends 0
  ? ""
  : N extends 1
    ? string & { length: 1; 0: string }
    : N extends 2
      ? string & { length: 2; 0: string; 1: string }
      : N extends 3
        ? string & { length: 3; 0: string; 1: string; 2: string }
        : N extends 4
          ? string & { length: 4; 0: string; 1: string; 2: string; 3: string }
          : N extends 5
            ? string & {
                length: 5;
                0: string;
                1: string;
                2: string;
                3: string;
                4: string;
              }
            : N extends 6
              ? string & {
                  length: 6;
                  0: string;
                  1: string;
                  2: string;
                  3: string;
                  4: string;
                  5: string;
                }
              : N extends 7
                ? string & {
                    length: 7;
                    0: string;
                    1: string;
                    2: string;
                    3: string;
                    4: string;
                    5: string;
                    6: string;
                  }
                : N extends 8
                  ? string & {
                      length: 8;
                      0: string;
                      1: string;
                      2: string;
                      3: string;
                      4: string;
                      5: string;
                      6: string;
                      7: string;
                    }
                  : N extends 9
                    ? string & {
                        length: 9;
                        0: string;
                        1: string;
                        2: string;
                        3: string;
                        4: string;
                        5: string;
                        6: string;
                        7: string;
                        8: string;
                      }
                    : N extends 10
                      ? string & {
                          length: 10;
                          0: string;
                          1: string;
                          2: string;
                          3: string;
                          4: string;
                          5: string;
                          6: string;
                          7: string;
                          8: string;
                          9: string;
                        }
                      : string & {
                          length: N;
                          0: string;
                          1: string;
                          2: string;
                          3: string;
                          4: string;
                          5: string;
                          6: string;
                          7: string;
                          8: string;
                          9: string;
                          10: string;
                        };

export type StringOfLengthMatcher<N extends number> = AssertionMatcher<
  StringOfLength<N>
> & {
  readonly [refinement]?: (actual: unknown) => StringOfLength<N>;
};

/**
 * Matcher for a string with exactly the expected length.
 */
export function stringOfLength<const N extends number>(
  expectedLength: N,
): StringOfLengthMatcher<N> {
  return createMatcher(
    (value): value is StringOfLength<N> =>
      typeof value === "string" && value.length === expectedLength,
    () => `string of length ${repr(expectedLength)}`,
    () => `String(${repr(expectedLength)})`,
  );
}
