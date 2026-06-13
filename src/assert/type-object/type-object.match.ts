import {
  type AssertionMatcher,
  createMatcher,
  type refinement,
} from "../../match/match.js";

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

/**
 * Matcher for an object value.
 */
export function typeObject(): TypeObjectMatcher {
  return createMatcher(
    (value): value is object => typeof value === "object" && value !== null,
    () => "object",
    () => "Object()",
  );
}
