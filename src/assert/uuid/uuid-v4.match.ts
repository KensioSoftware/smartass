import { createMatcher } from "../../match/match.js";
import {
  type UuidV4,
  uuidV4Matcher,
  type UuidV4Matcher,
} from "./uuid-v4.type.js";

const uuidV4Regex =
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

/**
 * Matcher for a UUID v4 string value.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, uuidV4 } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   id: "123e4567-e89b-42d3-a456-426614174000",
 * };
 *
 * assertObjectMatches(value, {
 *   id: uuidV4(),
 * });
 *
 * // value is now narrowed to an object with a UUID v4 id
 * // {
 * //   id: UuidV4;
 * // }
 * ```
 */
export function uuidV4(): UuidV4Matcher {
  return {
    ...createMatcher(
      (value): value is UuidV4 =>
        typeof value === "string" && uuidV4Regex.test(value),
      () => "UUID v4 string",
      () => "uuidV4()",
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [uuidV4Matcher]: true,
  };
}
