import { createMatcher } from "../../match/match.js";
import {
  typeFunctionMatcher,
  type TypeFunctionMatcher,
} from "./type-function.type.js";

/**
 * Matcher for a function value.
 */
export function typeFunction(): TypeFunctionMatcher {
  return {
    ...createMatcher(
      (value): value is Function => typeof value === "function",
      () => "function",
      () => "Function()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeFunctionMatcher]: true,
  };
}
