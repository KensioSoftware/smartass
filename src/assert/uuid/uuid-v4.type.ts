import type { UUID } from "node:crypto";
import type { AssertionMatcher, refinement } from "../../match/match.js";

/**
 * Unique symbol to reliably identify the UuidV4Matcher type.
 *
 * This keeps refinement dispatch nominal. Without this marker, structurally
 * similar string matchers could accidentally match the wrong conditional branch.
 */
export const uuidV4Matcher = Symbol("smartass.uuidV4Matcher");

type UuidV4Variant = "8" | "9" | "a" | "A" | "b" | "B";

export type UuidV4 = UUID &
  `${string}-${string}-4${string}-${UuidV4Variant}${string}-${string}`;

/**
 * Type produced when an actual value is matched by uuidV4().
 *
 * If the calling scope already knows UUID v4-compatible string information,
 * preserve that overlap. Otherwise, fall back to the standalone matcher type:
 * UuidV4.
 */
export type UuidV4Match<TActual> = [
  Extract<NonNullable<TActual>, UuidV4>,
] extends [never]
  ? UuidV4
  : Extract<NonNullable<TActual>, UuidV4>;

export type UuidV4Matcher = AssertionMatcher<UuidV4> & {
  readonly [uuidV4Matcher]: true;

  /**
   * Optional type-level hook used by compositional assertions such as
   * assertObjectMatches().
   *
   * This lets the matcher describe how it refines an existing actual type,
   * rather than only exposing the standalone matches() predicate type.
   */
  readonly [refinement]?: <TActual>(actual: TActual) => UuidV4Match<TActual>;
};
