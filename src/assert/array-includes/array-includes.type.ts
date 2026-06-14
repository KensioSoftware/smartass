import type { AssertionMatcher } from "../../match/match.js";

export type ArrayIncluding<T> = [T, ...T[]];
export type ArrayIncludingMatcher = AssertionMatcher<ArrayIncluding<unknown>>;
