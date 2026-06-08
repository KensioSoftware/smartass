import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

/**
 * Assert that a string has exactly the expected length, with type narrowing.
 *
 * The type narrowing indicates:
 *  - An empty string for 0
 *  - An exact length and safe indexing of known character positions up to 10
 *  - An exact length but no indexing for values greater than 10
 *
 * Note that this models JavaScript string indexing and length (UTF-16 code units),
 * not Unicode grapheme clusters.
 */
export function assertStringLength<const N extends number>(
  value: string,
  expectedLength: N,
  message?: string,
): asserts value is StringOfLength<N> {
  if (value.length !== expectedLength) {
    throw new AssertionError(
      message ??
        `Expected ${desc(value)} to have length ${repr(expectedLength)}, but it had length ${repr(value.length)}.`,
      value,
      { length: expectedLength },
    );
  }
}

type StringOfLength<N extends number> = N extends 0
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
                      : string & { length: N };
