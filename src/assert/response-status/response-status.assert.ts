import type { ResponseWithStatus } from "./response-status.type.js";
import type { ResponseDescription } from "../../describe/response/describe-response.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertInstanceOf } from "../instance-of/instance-of.assert.js";

/**
 * Assert that a Response has a specific HTTP status code, with type narrowing.
 * Pass describeResponse() as the third argument to include the response metadata
 * and body in the failure message.
 * @example
 * ```ts
 * import { assertResponseStatus, describeResponse } from "@kensio/smartass";
 *
 * const response = await fetch("https://example.com");
 *
 * assertResponseStatus(
 *   response,
 *   200,
 *   await describeResponse(response),
 * );
 *
 * // response.status is now narrowed to 200
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
