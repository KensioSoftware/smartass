import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the StringOfLengthMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const stringOfLengthMatcher = Symbol("smartass.stringOfLengthMatcher");

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

/**
 * Type produced when an actual value is matched by stringOfLength().
 *
 * The primary goal is to expose clean, readable user-facing types in IDE
 * tooltips and TypeScript errors. For exact length checks, the readable type is
 * StringOfLength<N>, which models exact length and safe indexing up to a fixed
 * limit.
 *
 * We intentionally do not try to recursively compute the length of arbitrary
 * string literal unions here. That would add significant type complexity and
 * noisier compiler output for limited practical gain.
 */
export type StringOfLengthMatch<TActual, N extends number> = [
  Extract<NonNullable<TActual>, StringOfLength<N>>,
] extends [never]
  ? StringOfLength<N>
  : Extract<NonNullable<TActual>, StringOfLength<N>>;

/**
 * Type produced when assertStringLength() narrows a value.
 *
 * Assertion functions must assert a type assignable to the asserted parameter's
 * original type. So the no-overlap fallback keeps the original actual string
 * type in an intersection.
 */
export type StringOfLengthAssertion<
  TActual extends string,
  N extends number,
> = [Extract<TActual, StringOfLength<N>>] extends [never]
  ? TActual & StringOfLength<N>
  : Extract<TActual, StringOfLength<N>>;

export type StringOfLengthMatcher<N extends number> = AssertionMatcher<
  StringOfLength<N>
> & {
  readonly [stringOfLengthMatcher]: N;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => StringOfLengthMatch<TActual, N>;
};
