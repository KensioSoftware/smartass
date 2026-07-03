import { repr } from "../../describe/describe.js";
import { createMatcher } from "../../match/match.js";
import {
  responseOfStatusMatcher,
  type ResponseOfStatusMatcher,
  type ResponseWithStatus,
} from "./response-status.type.js";

/**
 * Matcher for a Response with a specific HTTP status code.
 * Matchers are applied through assertObjectMatches, where they narrow the
 * corresponding property type.
 * Type information that already exists in the calling scope is incorporated.
 * @example
 * ```ts
 * import { assertObjectMatches, responseOfStatus } from "@kensio/smartass";
 *
 * const value: unknown = {
 *   response: await fetch("https://example.com"),
 * };
 *
 * assertObjectMatches(value, {
 *   response: responseOfStatus(200),
 * });
 *
 * // value is now narrowed to an object with a Response whose status is 200.
 * // {
 * //   response: Response & { readonly status: 200 };
 * // }
 * ```
 */
export function responseOfStatus<const TStatus extends number>(
  expectedStatus: TStatus,
): ResponseOfStatusMatcher<TStatus> {
  return {
    ...createMatcher(
      (value): value is ResponseWithStatus<TStatus> =>
        value instanceof Response && value.status === expectedStatus,
      () => `Response of status ${repr(expectedStatus)}`,
      () => `Response(status=${repr(expectedStatus)})`,
    ),
    // Runtime marker used only to make the matcher type nominal for type-level
    // refinement dispatch. It is not part of the user-facing matcher behaviour.
    [responseOfStatusMatcher]: expectedStatus,
  };
}
