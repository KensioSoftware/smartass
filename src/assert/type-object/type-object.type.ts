import type { AssertionMatcher, refinement } from "../../match/match.js";

type ObjectRefinement<TActual> = [
  Extract<NonNullable<TActual>, object>,
] extends [never]
  ? object
  : Extract<NonNullable<TActual>, object>;

export type TypeObjectMatcher = AssertionMatcher<object> & {
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ObjectRefinement<TActual>;
};
