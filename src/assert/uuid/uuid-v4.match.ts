import type { UUID } from "node:crypto";
import { createMatcher, type AssertionMatcher } from "../../match/match.js";

const uuidV4Regex =
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

export type UuidV4 = UUID &
  `${string}-${string}-4${string}-${"8" | "9" | "a" | "b"}${string}-${string}`;

/**
 * Matcher for a UUID v4 string value.
 */
export function uuidV4(): AssertionMatcher<UuidV4> {
  return createMatcher(
    (value): value is UuidV4 =>
      typeof value === "string" && uuidV4Regex.test(value),
    () => "UUID v4 string",
    () => "uuidV4()",
  );
}
