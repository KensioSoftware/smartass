import type { ResponseWithStatus } from "./response-status.type.js";
import type { ResponseDescription } from "../../describe/response/describe-response.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertInstanceOf } from "../instance-of/instance-of.assert.js";

export function assertResponseStatus<const TStatus extends number>(
  response: Response,
  expectedStatus: TStatus,
  messageOrDescription?: string | ResponseDescription,
): asserts response is ResponseWithStatus<TStatus>;

/**
 * Assert that a Response has a specific HTTP status code, with type narrowing.
 * Optionally use describeResponse() for the third argument to get more detailed
 * diagnostic information if the assertion fails.
 * @example
 * ```ts
 * import { assertResponseStatus } from "@kensio/smartass";
 *
 * const response = await fetch("https://example.com");
 *
 * assertResponseStatus(response, 200);
 *
 * // response.status is now narrowed to 200
 * ```
 * @example
 * ```ts
 * import { assertResponseStatus, describeResponse } from "@kensio/smartass";
 *
 * const res = await fetch("https://example.com");
 *
 * assertResponseStatus(res, 200, await describeResponse(res));
 * ```
 */
export function assertResponseStatus<const TStatus extends number>(
  response: unknown,
  expectedStatus: TStatus,
  messageOrDescription?: string | ResponseDescription,
): asserts response is ResponseWithStatus<TStatus> {
  assertInstanceOf(response, Response);
  if (response.status !== expectedStatus) {
    throw new AssertionError(
      typeof messageOrDescription === "string"
        ? messageOrDescription
        : buildResponseStatusMessage(
            messageOrDescription ?? response,
            expectedStatus,
            response.status,
          ),
      response.status,
      expectedStatus,
    );
  }
}

function buildResponseStatusMessage(
  responseOrDescription: Response | ResponseDescription,
  expectedStatus: number,
  actualStatus: number,
): string {
  return [
    `Expected response to have status ${repr(expectedStatus)} but had status ${repr(
      actualStatus,
    )}.`,
    desc(responseOrDescription),
  ].join("\n");
}
