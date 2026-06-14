import { createMatcher } from "../../match/match.js";
import type { TypeObjectMatcher } from "./type-object.type.js";

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
