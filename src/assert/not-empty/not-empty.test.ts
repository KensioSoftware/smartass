import { describe, expect, it } from "vitest";
import { assertNotEmpty } from "./not-empty.assert.js";

describe("not-empty", () => {
  it("throws on empty array", () => {
    expect(() => {
      assertNotEmpty([]);
    }).toThrowError("Expected array not to be empty, but it was empty.");
  });

  it("throws on null", () => {
    expect(() => {
      assertNotEmpty(null);
    }).toThrowError("Expected value not to be null, but it was null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertNotEmpty(undefined);
    }).toThrowError(
      "Expected value not to be undefined, but it was undefined.",
    );
  });
});
