export interface ResponseDescription {
  readonly response: Response;
  readonly status: number;
  readonly statusText: string;
  readonly ok: boolean;
  readonly url: string;
  readonly redirected: boolean;
  readonly type: Response["type"];
  readonly headers: readonly [string, string][];
  readonly bodyUsed: boolean;
  readonly bodyText?: string;
  readonly bodyReadError?: string;
}

/**
 * Build an enhanced diagnostic description of a Response.
 *
 * This helper clones the response before reading its body, so the original
 * response remains available to the caller. If the original body has already
 * been consumed, or if cloning or reading the body fails, the returned
 * description still includes the synchronously available response metadata.
 *
 * The result can be passed to assertResponseStatus() as the third argument to
 * include body text and other captured details in assertion failure messages.
 * @example
 * ```ts
 * import { assertResponseStatus, describeResponse } from "@kensio/smartass";
 *
 * const res = await fetch("https://example.com");
 *
 * assertResponseStatus(res, 200, await describeResponse(res));
 * ```
 */
export async function describeResponse(
  response: Response,
): Promise<ResponseDescription> {
  const base = buildBaseResponseDescription(response);

  if (response.bodyUsed) {
    return base;
  }

  try {
    const clone = response.clone();
    const bodyText = await clone.text();

    return {
      ...base,
      bodyText,
    };
  } catch (error) {
    return {
      ...base,
      bodyReadError:
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error),
    };
  }
}

function buildBaseResponseDescription(response: Response): ResponseDescription {
  return {
    response,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    url: response.url,
    redirected: response.redirected,
    type: response.type,
    headers: [...response.headers.entries()],
    bodyUsed: response.bodyUsed,
  };
}
