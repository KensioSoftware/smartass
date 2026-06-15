import { createMatcher } from "../../match/match.js";
import {
  typeStringMatcher,
  type TypeStringMatcher,
} from "./type-string.type.js";

/**
 * Matcher for a string value.
 */
export function typeString(): TypeStringMatcher {
  return {
    ...createMatcher(
      (value): value is string => typeof value === "string",
      () => "string",
      () => "String()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeStringMatcher]: true,
  };
}
