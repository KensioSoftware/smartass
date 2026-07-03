import { describe, expect, expectTypeOf, it } from "vitest";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertResponseStatus } from "./response-status.assert.js";
import { describeResponse } from "../../describe/response/describe-response.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { responseOfStatus } from "./response-status.match.js";

describe("response-status", () => {
  describe("assertResponseStatus", () => {
    it("does not throw when the response status matches", () => {
      const response = new Response("ok", { status: 200 });

      expect(() => {
        assertResponseStatus(response, 200);
      }).not.toThrow();
    });

    it("throws when the response status does not match", () => {
      const response = new Response("not found", {
        status: 404,
        statusText: "Not Found",
        headers: {
          "content-type": "text/plain",
        },
      });

      expect(() => {
        assertResponseStatus(response, 200);
      }).toThrow(AssertionError);

      expect(() => {
        assertResponseStatus(response, 200);
      }).toThrow("Expected Response");
    });

    it("uses a custom message when provided", () => {
      const response = new Response("not found", { status: 404 });

      expect(() => {
        assertResponseStatus(response, 200, "Custom response failure");
      }).toThrow("Custom response failure");
    });

    it("narrows the response status to the expected literal status", () => {
      const response: Response = new Response("ok", { status: 201 });

      assertResponseStatus(response, 201);

      expectTypeOf(response.status).toEqualTypeOf<201>();
      expect(response.status).toBe(201);
    });

    it("uses an enhanced response description when provided", async () => {
      const response = new Response("nope", {
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "content-type": "text/plain",
        },
      });

      const description = await describeResponse(response);

      expect(() => {
        assertResponseStatus(response, 200, description);
      }).toThrow("bodyText");
    });
  });

  describe("describeResponse", () => {
    it("reads the cloned response body without consuming the original body", async () => {
      const response = new Response("hello", { status: 418 });

      const description = await describeResponse(response);

      expect(description.bodyText).toBe("hello");
      expect(response.bodyUsed).toBe(false);
      await expect(response.text()).resolves.toBe("hello");
    });

    it("still returns useful metadata if the original body is already used", async () => {
      const response = new Response("hello", { status: 400 });
      await response.text();

      const description = await describeResponse(response);

      expect(description.status).toBe(400);
      expect(description.bodyUsed).toBe(true);
      expect(description.bodyText).toBeUndefined();
    });

    it("integrates with desc and repr for plain responses", () => {
      const response = new Response("hello", {
        status: 202,
        statusText: "Accepted",
      });

      expect(desc(response)).toContain("Response");
      expect(repr(response)).toContain("status=202");
      expect(repr(response)).toContain('statusText="Accepted"');
    });

    it("integrates with desc and repr for response descriptions", async () => {
      const response = new Response("hello", {
        status: 202,
        statusText: "Accepted",
      });

      const description = await describeResponse(response);

      expect(desc(description)).toContain("ResponseDescription");
      expect(repr(description)).toContain("status=202");
      expect(repr(description)).toContain('bodyText="hello"');
    });
  });

  describe("responseOfStatus", () => {
    it("matches a Response with the expected status", () => {
      const matcher = responseOfStatus(200);

      expect(matcher.matches(new Response("ok", { status: 200 }))).toBe(true);
    });

    it("does not match a Response with a different status", () => {
      const matcher = responseOfStatus(200);

      expect(matcher.matches(new Response("not found", { status: 404 }))).toBe(
        false,
      );
    });

    it("does not match non-Response values", () => {
      const matcher = responseOfStatus(200);

      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches({ status: 200 })).toBe(false);
      expect(matcher.matches("response")).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = responseOfStatus(201);

      expect(desc(matcher)).toBe("Response of status 201");
    });

    it("represents the matcher", () => {
      const matcher = responseOfStatus(201);

      expect(repr(matcher)).toBe("Response(status=201)");
    });

    it("works as a composable matcher", () => {
      const value: unknown = {
        response: new Response("created", { status: 201 }),
      };

      assertObjectMatches(value, {
        response: responseOfStatus(201),
      });

      expectTypeOf(value.response).toEqualTypeOf<
        Response & { readonly status: 201 }
      >();
      expect(value.response.status).toBe(201);
    });

    it("narrows a known Response property to the expected status", () => {
      interface Result {
        readonly response?: Response;
      }

      const value: Result = {
        response: new Response("accepted", { status: 202 }),
      };

      assertObjectMatches(value, {
        response: responseOfStatus(202),
      });

      expectTypeOf(value.response.status).toEqualTypeOf<202>();
      expect(value.response.status).toBe(202);
    });

    it("fails through assertObjectMatches when the nested response status differs", () => {
      const value = {
        response: new Response("not found", { status: 404 }),
      };

      expect(() => {
        assertObjectMatches(value, {
          response: responseOfStatus(200),
        });
      }).toThrow("Response(status=200)");
    });
  });
});
