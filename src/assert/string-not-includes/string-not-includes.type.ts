import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the StringNotIncludingMatcher type.
 *
 * TypeScript is structurally typed, so matcher types with similar predicates
 * can otherwise accidentally satisfy each other's conditional branches.
 */
export const stringNotIncludingMatcher = Symbol(
  "smartass.stringNotIncludingMatcher",
);

/**
 * Type produced when an actual value is matched by stringNotIncluding().
 *
 * When the calling scope already has string literal information, we preserve the
 * literals that do not include the forbidden substring. Otherwise, we fall back
 * to the matcher's standalone string predicate type.
 */
export type StringNotIncludingMatch<TActual, TSubstring extends string> = [
  Exclude<
    Extract<NonNullable<TActual>, string>,
    `${string}${TSubstring}${string}`
  >,
] extends [never]
  ? Exclude<string, `${string}${TSubstring}${string}`>
  : Exclude<
      Extract<NonNullable<TActual>, string>,
      `${string}${TSubstring}${string}`
    >;

export type StringNotIncludingMatcher<TSubstring extends string> =
  AssertionMatcher<Exclude<string, `${string}${TSubstring}${string}`>> & {
    readonly [stringNotIncludingMatcher]: TSubstring;

    /**
     * Optional type-level hook used by compositional assertions such as
     * assertObjectMatches().
     *
     * This lets the matcher describe how it refines an existing actual type,
     * rather than only exposing the standalone matches() predicate type.
     */
    readonly [refinement]?: <TActual>(
      actual: TActual,
    ) => StringNotIncludingMatch<TActual, TSubstring>;
  };
