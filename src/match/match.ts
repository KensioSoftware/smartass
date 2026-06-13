const matcher = Symbol("smartass.matcher");
export declare const refinement: unique symbol;

export interface AssertionMatcher<T> {
  readonly [matcher]: true;
  matches(value: unknown): value is T;
  describe(): string;
  represent(): string;
}

type ApplyRefinement<TRefinement, TActual> = TRefinement extends (
  actual: TActual,
) => infer TRefined
  ? TRefined
  : never;

export type RefinedMatch<TMatcher, TActual> = TMatcher extends {
  readonly [refinement]?: infer TRefinement;
}
  ? ApplyRefinement<TRefinement, TActual>
  : TMatcher extends AssertionMatcher<infer TMatched>
    ? TActual & TMatched
    : TActual & InferMatch<TMatcher>;

export type InferMatch<T> =
  T extends AssertionMatcher<infer U>
    ? U
    : T extends readonly unknown[]
      ? T
      : T extends object
        ? { [K in keyof T]: InferMatch<T[K]> }
        : T;

/**
 * Create a matcher from a function that returns whether a value matches.
 */
export function createMatcher<T>(
  matches: (value: unknown) => value is T,
  describe: () => string,
  represent: () => string,
): AssertionMatcher<T> {
  return {
    [matcher]: true,
    matches,
    describe,
    represent,
  };
}

/**
 * Check whether a value is a matcher.
 */
export function isMatcher(value: unknown): value is AssertionMatcher<unknown> {
  return typeof value === "object" && value !== null && matcher in value;
}
