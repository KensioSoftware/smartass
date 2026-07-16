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

/**
 * Build a readable multiline description from the synchronously available
 * metadata of a Response.
 */
export function describeResponseMetadata(response: Response): string {
  return describeResponseDescription(buildBaseResponseDescription(response));
}

/**
 * Format a captured response description as a readable multiline diagnostic.
 */
export function describeResponseDescription(
  description: ResponseDescription,
): string {
  return [
    "Response:",
    ...formatResponseDescriptionLines(description).map((line) => `  ${line}`),
  ].join("\n");
}

/**
 * Represent a Response as a concise single-line diagnostic string.
 */
export function reprResponse(response: Response): string {
  return reprResponseDescription(buildBaseResponseDescription(response));
}

/**
 * Represent a captured response description as a concise single-line diagnostic
 * string.
 */
export function reprResponseDescription(
  description: ResponseDescription,
): string {
  const values = [`status=${String(description.status)}`];

  if (description.statusText !== "") {
    values.push(`statusText=${JSON.stringify(description.statusText)}`);
  }

  const contentType = getHeaderValue(description.headers, "content-type");
  if (contentType !== undefined) {
    values.push(`contentType=${JSON.stringify(contentType)}`);
  }

  if (description.bodyText !== undefined) {
    values.push(`body=${JSON.stringify(description.bodyText)}`);
  }

  return `Response(${values.join(",")})`;
}

function getHeaderValue(
  headers: readonly [string, string][],
  name: string,
): string | undefined {
  const normalizedName = name.toLowerCase();

  return headers.find(
    ([headerName]) => headerName.toLowerCase() === normalizedName,
  )?.[1];
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
    // eslint-disable-next-line unicorn/prefer-iterator-to-array
    headers: [...response.headers.entries()],
    bodyUsed: response.bodyUsed,
  };
}

function formatResponseDescriptionLines(
  description: ResponseDescription,
): string[] {
  const lines = [
    `status: ${String(description.status)}`,
    `ok: ${String(description.ok)}`,
  ];

  if (description.statusText !== "") {
    lines.push(`statusText: ${description.statusText}`);
  }

  if (description.url !== "") {
    lines.push(`url: ${description.url}`);
  }

  if (description.redirected) {
    lines.push(`redirected: ${String(description.redirected)}`);
  }

  if (description.type !== "default") {
    lines.push(`type: ${description.type}`);
  }

  if (description.headers.length > 0) {
    lines.push(
      "headers:",
      ...description.headers.map(([name, value]) => `  ${name}: ${value}`),
    );
  }

  if (description.bodyUsed) {
    lines.push("bodyUsed: true");
  }

  if (description.bodyText !== undefined && description.bodyText !== "") {
    lines.push("body:", ...indentMultiline(description.bodyText));
  }

  if (description.bodyReadError !== undefined) {
    lines.push(
      "body read error:",
      ...indentMultiline(description.bodyReadError),
    );
  }

  return lines;
}

function indentMultiline(value: string): string[] {
  return value.split("\n").map((line) => `  ${line}`);
}
