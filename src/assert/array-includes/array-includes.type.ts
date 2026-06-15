import type { AssertionMatcher } from "../../match/match.js";

export type ArrayIncluding<T> = [T, ...unknown[]];
export type ArrayIncludingMatcher<T = unknown> = AssertionMatcher<
  ArrayIncluding<T>
>;
