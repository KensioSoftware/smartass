import type { AssertionMatcher } from "../../match/match.js";

export type NonEmptyArray<T> = [T, ...T[]];

export type NonEmptyArrayMatcher = AssertionMatcher<NonEmptyArray<unknown>>;
