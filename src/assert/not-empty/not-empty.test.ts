import { describe, expect, it } from "vitest";
import { assertNotEmpty } from "./not-empty.assert.js";
import type { AssertionError } from "../../assertion-error.js";

describe("not-empty", () => {
  it("throws on empty array", () => {
    let error: AssertionError;
    try {
      assertNotEmpty([]);
      expect.unreachable();
    } catch (error_: any) {
      error = error_;
    }
    expect(error.message).toBe(
      "Expected array not to be empty, but it was empty.",
    );
    expect(error.actual).toStrictEqual([]);
    expect(error.expected).toStrictEqual(["..."]);
  });

  it("throws on null", () => {
    expect(() => {
      assertNotEmpty(null);
    }).toThrowError("Expected null not to be null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertNotEmpty(undefined);
    }).toThrowError("Expected undefined not to be undefined.");
  });
});
