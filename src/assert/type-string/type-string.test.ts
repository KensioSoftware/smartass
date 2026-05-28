import { describe, expect, it } from "vitest";
import { assertTypeString } from "./type-string.assert.js";

describe("type-string", () => {
  it("throws when value is not a string", () => {
    expect(() => {
      assertTypeString(123);
    }).toThrow("Expected number 123 to be of type string.");
  });

  it("does not throw when value is a string", () => {
    expect(() => {
      assertTypeString("hello");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeString(123, "Custom error message");
    }).toThrow("Custom error message");
  });

  it("works with various non-string types", () => {
    expect(() => {
      assertTypeString(null);
    }).toThrow("Expected null to be of type string.");
    expect(() => {
      assertTypeString(undefined);
    }).toThrow("Expected undefined to be of type string.");
    expect(() => {
      assertTypeString(true);
    }).toThrow("Expected boolean true to be of type string.");
    expect(() => {
      assertTypeString({});
    }).toThrow("Expected object {} to be of type string.");
  });
});
