import { createMatcher } from "../../match/match.js";
import {
  typeNumericMatcher,
  type TypeNumericMatcher,
} from "./type-numeric.type.js";

/**
 * Matcher for a numeric value (number or bigint).
 */
export function typeNumeric(): TypeNumericMatcher {
  return {
    ...createMatcher(
      (value): value is number | bigint =>
        typeof value === "number" || typeof value === "bigint",
      () => "numeric",
      () => "Number()|BigInt()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [typeNumericMatcher]: true,
  };
}
