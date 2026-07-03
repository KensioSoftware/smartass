import { describe, expect, it } from "vitest";
import {
  describeResponse,
  describeResponseDescription,
  describeResponseMetadata,
  reprResponse,
  reprResponseDescription,
  type ResponseDescription,
} from "./describe-response.js";
import { desc, repr } from "../describe.js";

describe("desc() and repr() Response", () => {
  describe("describeResponse", () => {
    it("captures response metadata and cloned body text without consuming the original", async () => {
      const response = new Response("created", {
        status: 201,
        statusText: "Created",
        headers: {
          "content-type": "text/plain",
          "x-request-id": "abc-123",
        },
      });

      const description = await describeResponse(response);

      expect(description).toMatchObject({
        response,
        status: 201,
        statusText: "Created",
        ok: true,
        url: "",
        redirected: false,
        type: "default",
        bodyUsed: false,
        bodyText: "created",
      });
      expect(description.headers).toContainEqual([
        "content-type",
        "text/plain",
      ]);
      expect(description.headers).toContainEqual(["x-request-id", "abc-123"]);
      expect(description.bodyReadError).toBeUndefined();

      expect(response.bodyUsed).toBe(false);
      await expect(response.text()).resolves.toBe("created");
    });

    it("captures an empty response body as an empty string", async () => {
      const response = new Response(null, { status: 204 });

      const description = await describeResponse(response);

      expect(description.status).toBe(204);
      expect(description.bodyText).toBe("");
      expect(description.bodyReadError).toBeUndefined();
      expect(response.bodyUsed).toBe(false);
    });

    it("returns metadata only when the original body has already been consumed", async () => {
      const response = new Response("already consumed", { status: 400 });
      await response.text();

      const description = await describeResponse(response);

      expect(description).toMatchObject({
        response,
        status: 400,
        ok: false,
        bodyUsed: true,
      });
      expect(description.bodyText).toBeUndefined();
      expect(description.bodyReadError).toBeUndefined();
    });

    it("captures JSON response bodies as raw text", async () => {
      const response = Response.json(
        { message: "hello", ok: true },
        { status: 202, statusText: "Accepted" },
      );

      const description = await describeResponse(response);

      expect(description.status).toBe(202);
      expect(description.statusText).toBe("Accepted");
      expect(description.headers).toContainEqual([
        "content-type",
        "application/json",
      ]);
      expect(description.bodyText).toBe('{"message":"hello","ok":true}');
    });

    it("captures binary response bodies as decoded text", async () => {
      const response = new Response(new Uint8Array([104, 101, 108, 108, 111]), {
        status: 200,
        headers: {
          "content-type": "application/octet-stream",
        },
      });

      const description = await describeResponse(response);

      expect(description.bodyText).toBe("hello");
      expect(description.headers).toContainEqual([
        "content-type",
        "application/octet-stream",
      ]);
    });

    it("captures an Error thrown while cloning or reading the response body", async () => {
      const response = new Response("uncloneable", {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
          "retry-after": "30",
        },
      });

      Object.defineProperty(response, "clone", {
        value() {
          throw new TypeError("cannot clone response");
        },
      });

      const description = await describeResponse(response);

      expect(description).toMatchObject({
        response,
        status: 503,
        statusText: "Service Unavailable",
        ok: false,
        bodyUsed: false,
        bodyReadError: "TypeError: cannot clone response",
      });
      expect(description.headers).toContainEqual(["retry-after", "30"]);
      expect(description.bodyText).toBeUndefined();
    });

    it("captures a non-Error value thrown while cloning or reading the response body", async () => {
      const response = new Response("unreadable", { status: 500 });

      Object.defineProperty(response, "clone", {
        value() {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw "clone failed";
        },
      });

      await expect(describeResponse(response)).resolves.toMatchObject({
        status: 500,
        bodyReadError: "clone failed",
      });
    });
  });

  describe("describeResponseMetadata", () => {
    it("formats synchronously available metadata for a plain response", () => {
      const response = new Response("ignored body", {
        status: 202,
        statusText: "Accepted",
        headers: {
          "x-request-id": "abc-123",
        },
      });

      expect(describeResponseMetadata(response)).toBe(
        [
          "Response:",
          "  status: 202",
          "  ok: true",
          "  statusText: Accepted",
          "  headers:",
          "    content-type: text/plain;charset=UTF-8",
          "    x-request-id: abc-123",
        ].join("\n"),
      );
    });
  });

  describe("describeResponseDescription", () => {
    it("formats optional metadata, body text, and body read errors", () => {
      const description = makeDescription({
        status: 302,
        statusText: "Found",
        ok: false,
        url: "https://example.test/resource",
        redirected: true,
        type: "basic",
        headers: [["content-type", "text/plain"]],
        bodyUsed: true,
        bodyText: "line one\nline two",
        bodyReadError: "Error: failed\nbecause stream ended",
      });

      expect(describeResponseDescription(description)).toBe(
        [
          "Response:",
          "  status: 302",
          "  ok: false",
          "  statusText: Found",
          "  url: https://example.test/resource",
          "  redirected: true",
          "  type: basic",
          "  headers:",
          "    content-type: text/plain",
          "  bodyUsed: true",
          "  body:",
          "    line one",
          "    line two",
          "  body read error:",
          "    Error: failed",
          "    because stream ended",
        ].join("\n"),
      );
    });

    it("omits an empty body from multiline descriptions", () => {
      const description = makeDescription({
        bodyText: "",
      });

      expect(describeResponseDescription(description)).toBe(
        ["Response:", "  status: 200", "  ok: true"].join("\n"),
      );
    });
  });

  describe("reprResponse", () => {
    it("represents synchronously available response metadata", () => {
      const response = new Response("ignored body", {
        status: 404,
        statusText: "Not Found",
        headers: {
          "content-type": "text/plain",
        },
      });

      expect(reprResponse(response)).toBe(
        'Response(status=404,statusText="Not Found",contentType="text/plain")',
      );
    });

    it("omits empty status text and missing content type", () => {
      const response = new Response(null, { status: 204 });

      expect(reprResponse(response)).toBe("Response(status=204)");
    });
  });

  describe("reprResponseDescription", () => {
    it("represents status, status text, content type, and body text", () => {
      const description = makeDescription({
        status: 302,
        statusText: "Found",
        ok: false,
        url: "https://example.test/resource",
        redirected: true,
        type: "basic",
        headers: [
          ["x-request-id", "abc-123"],
          ["content-type", "text/plain"],
        ],
        bodyUsed: true,
        bodyText: "hello",
        bodyReadError: "Error: failed",
      });

      expect(reprResponseDescription(description)).toBe(
        'Response(status=302,statusText="Found",contentType="text/plain",body="hello")',
      );
    });

    it("represents an empty captured body", () => {
      const description = makeDescription({
        bodyText: "",
      });

      expect(reprResponseDescription(description)).toBe(
        'Response(status=200,body="")',
      );
    });
  });

  describe("desc and repr integrations", () => {
    it("describe and represent plain responses", () => {
      const response = new Response("hello", {
        status: 202,
        statusText: "Accepted",
      });

      expect(desc(response)).toContain("Response:");
      expect(desc(response)).toContain("status: 202");
      expect(repr(response)).toBe(
        'Response(status=202,statusText="Accepted",contentType="text/plain;charset=UTF-8")',
      );
    });

    it("describe and represent captured response descriptions", async () => {
      const response = new Response("hello", {
        status: 202,
        statusText: "Accepted",
      });

      const description = await describeResponse(response);

      expect(desc(description)).toContain("Response:");
      expect(desc(description)).not.toContain("ResponseDescription");
      expect(repr(description)).toBe(
        // eslint-disable-next-line no-secrets/no-secrets
        'Response(status=202,statusText="Accepted",contentType="text/plain;charset=UTF-8",body="hello")',
      );
    });
  });
});

function makeDescription(
  overrides: Partial<ResponseDescription> = {},
): ResponseDescription {
  const response = new Response(null, { status: 200 });

  return {
    response,
    status: 200,
    statusText: "",
    ok: true,
    url: "",
    redirected: false,
    type: "default",
    headers: [],
    bodyUsed: false,
    ...overrides,
  };
}
