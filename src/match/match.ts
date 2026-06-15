const matcher = Symbol("smartass.matcher");
export declare const refinement: unique symbol;

export interface AssertionMatcher<T> {
  readonly [matcher]: true;
  matches(value: unknown): value is T;
  describe(): string;
  represent(): string;
}

/**
 * Matcher refinement architecture
 * --------------------------------
 *
 * Matchers have two related but different type-level jobs:
 *
 * 1. Standalone matching:
 *    matcher.matches(value) narrows unknown values to the matcher's basic
 *    predicate type.
 *
 * 2. Compositional matching:
 *    assertObjectMatches() applies matchers inside an existing object type, so
 *    matchers should preserve useful information from the calling scope where
 *    possible.
 *
 * For example, arrayIncluding("beta") should narrow an unknown value to
 * ["beta", ...unknown[]], but a known string[] property to
 * ["beta", ...string[]]. The latter is more useful and more readable than an
 * opaque intersection type.
 *
 * Matchers may expose an optional [refinement] hook to describe this
 * actual-type-aware narrowing. Some matchers also export a semantic *Match type
 * and have an explicit branch in object-matches.type.ts. That is intentional:
 * TypeScript cannot always apply generic refinement hooks precisely enough
 * through conditional inference.
 *
 * The main priority is user-facing type readability in IDE tooltips and
 * compiler errors. Prefer plain TypeScript types such as:
 *
 *   ["beta", ...string[]]
 *   [string, string]
 *   "draft" | "published"
 *   `${string}.json`
 *
 * over internal helper names or complex intersections where practical.
 */
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
