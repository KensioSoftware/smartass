import { describe, expect, it } from "vitest";
import { assertTypeString } from "./type-string.assert.js";

describe("type-string", () => {
  it("throws when value is not a string", () => {
    expect(() => {
      assertTypeString(123);
    }).toThrowError(
      "Expected 123 to be of type string, but it was of type number",
    );
  });

  it("does not throw when value is a string", () => {
    expect(() => {
      assertTypeString("hello");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeString(123, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with various non-string types", () => {
    expect(() => {
      assertTypeString(null);
    }).toThrowError(
      "Expected null to be of type string, but it was of type object",
    );
    expect(() => {
      assertTypeString(undefined);
    }).toThrowError(
      "Expected undefined to be of type string, but it was of type undefined",
    );
    expect(() => {
      assertTypeString(true);
    }).toThrowError(
      "Expected true to be of type string, but it was of type boolean",
    );
    expect(() => {
      assertTypeString({});
    }).toThrowError(
      "Expected [object Object] to be of type string, but it was of type object",
    );
  });
});
