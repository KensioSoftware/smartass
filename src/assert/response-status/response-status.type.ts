import type { AssertionMatcher, refinement } from "../../match/match.js";

export type ResponseWithStatus<TStatus extends number> = Response & {
  readonly status: TStatus;
};

/**
 * Unique symbol to reliably identify the ResponseOfStatusMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates can
 * otherwise accidentally satisfy each other's conditional branches.
 */
export const responseOfStatusMatcher = Symbol(
  "smartass.responseOfStatusMatcher",
);

/**
 * Type produced when an actual value is matched by responseOfStatus().
 *
 * When the calling scope already has a compatible Response status refinement, we
 * preserve that overlap. Otherwise, we fall back to a Response with the expected
 * status literal.
 */
export type ResponseOfStatusMatch<TActual, TStatus extends number> = [
  Extract<NonNullable<TActual>, ResponseWithStatus<TStatus>>,
] extends [never]
  ? ResponseWithStatus<TStatus>
  : Extract<NonNullable<TActual>, ResponseWithStatus<TStatus>>;

export type ResponseOfStatusMatcher<TStatus extends number> = AssertionMatcher<
  ResponseWithStatus<TStatus>
> & {
  readonly [responseOfStatusMatcher]: TStatus;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(
    actual: TActual,
  ) => ResponseOfStatusMatch<TActual, TStatus>;
};
