import { describe, expect, it } from "vitest";
import { describeResponse } from "./describe-response.js";
import { repr } from "../describe.js";

describe("describeResponse", () => {
  it("captures synchronously available response metadata", async () => {
    const response = new Response("created", {
      status: 201,
      statusText: "Created",
      headers: {
        "content-type": "text/plain",
        "x-request-id": "abc-123",
      },
    });

    const description = await describeResponse(response);

    expect(description.response).toBe(response);
    expect(description.status).toBe(201);
    expect(description.statusText).toBe("Created");
    expect(description.ok).toBe(true);
    expect(description.url).toBe("");
    expect(description.redirected).toBe(false);
    expect(description.type).toBe("default");
    expect(description.headers).toContainEqual(["content-type", "text/plain"]);
    expect(description.headers).toContainEqual(["x-request-id", "abc-123"]);
    expect(description.bodyUsed).toBe(false);
  });

  it("reads the cloned response body", async () => {
    const response = new Response("hello response body", {
      status: 418,
      statusText: "I'm a Teapot",
    });

    const description = await describeResponse(response);

    expect(description.bodyText).toBe("hello response body");
    expect(description.bodyReadError).toBeUndefined();
  });

  it("does not consume the original response body", async () => {
    const response = new Response("still available", { status: 200 });

    const description = await describeResponse(response);

    expect(description.bodyText).toBe("still available");
    expect(description.bodyReadError).toBeUndefined();
    expect(response.bodyUsed).toBe(false);
    await expect(response.text()).resolves.toBe("still available");
  });

  it("captures an empty body as an empty string", async () => {
    const response = new Response(null, { status: 204 });

    const description = await describeResponse(response);

    expect(description.bodyText).toBe("");
    expect(description.bodyReadError).toBeUndefined();
    expect(response.bodyUsed).toBe(false);
  });

  it("does not clone or read the body when the original body is already used", async () => {
    const response = new Response("already consumed", { status: 400 });
    await response.text();

    const description = await describeResponse(response);

    expect(description.response).toBe(response);
    expect(description.status).toBe(400);
    expect(description.statusText).toBe("");
    expect(description.ok).toBe(false);
    expect(description.bodyUsed).toBe(true);
    expect(description.bodyText).toBeUndefined();
    expect(description.bodyReadError).toBeUndefined();
  });

  it("captures JSON response bodies as raw text", async () => {
    const response = Response.json(
      {
        message: "hello",
        ok: true,
      },
      {
        status: 202,
        statusText: "Accepted",
      },
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

  it("still returns metadata when cloning a real Response throws", async () => {
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

    expect(description.response).toBe(response);
    expect(description.status).toBe(503);
    expect(description.statusText).toBe("Service Unavailable");
    expect(description.ok).toBe(false);
    expect(description.headers).toContainEqual(["retry-after", "30"]);
    expect(description.bodyUsed).toBe(false);
    expect(description.bodyText).toBeUndefined();
    expect(description.bodyReadError).toBe("TypeError: cannot clone response");
    expect(repr(description)).toContain(
      'bodyReadError="TypeError: cannot clone response"',
    );
  });
});
