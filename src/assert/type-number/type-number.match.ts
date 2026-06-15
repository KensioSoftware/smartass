import { createMatcher } from "../../match/match.js";
import {
  typeNumberMatcher,
  type TypeNumberMatcher,
} from "./type-number.type.js";

/**
 * Matcher for a number value.
 */
export function typeNumber(): TypeNumberMatcher {
  return {
    ...createMatcher(
      (value): value is number => typeof value === "number",
      () => "number",
      () => "Number()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeNumberMatcher]: true,
  };
}
