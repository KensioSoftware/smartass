import { createMatcher } from "../../match/match.js";
import type { UuidV4, UuidV4Matcher } from "./uuid-v4.type.js";

const uuidV4Regex =
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

/**
 * Matcher for a UUID v4 string value.
 */
export function uuidV4(): UuidV4Matcher {
  return createMatcher(
    (value): value is UuidV4 =>
      typeof value === "string" && uuidV4Regex.test(value),
    () => "UUID v4 string",
    () => "uuidV4()",
  );
}
