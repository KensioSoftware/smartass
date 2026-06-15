import type { AssertionMatcher, refinement } from "../../match/match.js";

export type NonNullableMatcher = AssertionMatcher<NonNullable<unknown>> & {
  readonly [refinement]?: <TActual>(actual: TActual) => NonNullable<TActual>;
};
