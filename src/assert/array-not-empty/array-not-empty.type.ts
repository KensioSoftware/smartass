import type { AssertionMatcher } from "../../match/match.js";

export type NonEmptyArray<T> = readonly [T, ...T[]];

export type NonEmptyArrayMatcher = AssertionMatcher<NonEmptyArray<unknown>>;
