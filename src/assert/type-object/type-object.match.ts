import { createMatcher } from "../../match/match.js";
import {
  typeObjectMatcher,
  type TypeObjectMatcher,
} from "./type-object.type.js";

/**
 * Matcher for an object value.
 */
export function typeObject(): TypeObjectMatcher {
  return {
    ...createMatcher(
      (value): value is object => typeof value === "object" && value !== null,
      () => "object",
      () => "Object()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeObjectMatcher]: true,
  };
}
