import { createMatcher } from "../../match/match.js";
import {
  typeBooleanMatcher,
  type TypeBooleanMatcher,
} from "./type-boolean.type.js";

/**
 * Matcher for a boolean value.
 */
export function typeBoolean(): TypeBooleanMatcher {
  return {
    ...createMatcher(
      (value): value is boolean => typeof value === "boolean",
      () => "boolean",
      () => "Boolean()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeBooleanMatcher]: true,
  };
}
