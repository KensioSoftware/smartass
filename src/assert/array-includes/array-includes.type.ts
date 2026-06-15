import type { AssertionMatcher, refinement } from "../../match/match.js";

export type ArrayIncluding<T> = [T, ...unknown[]];
export type ArrayIncludingMatcher<T = unknown> = AssertionMatcher<
  ArrayIncluding<T>
> & {
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => [Extract<NonNullable<TActual>, readonly unknown[]>] extends [never]
    ? [T, ...unknown[]]
    : [
        Extract<NonNullable<TActual>, readonly unknown[]>[number],
        ...Extract<NonNullable<TActual>, readonly unknown[]>[number][],
      ];
};
