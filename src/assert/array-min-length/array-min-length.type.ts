import type { AssertionMatcher } from "../../match/match.js";

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
