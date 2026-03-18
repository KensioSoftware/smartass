import { describe, expect, it } from "vitest";
import { assertFalse } from "./false.assert.js";

describe("assertFalse", () => {
  it("should pass when value is false", () => {
    expect(() => {
      assertFalse(false);
    }).not.toThrow();
  });

  it("should fail when value is true", () => {
    expect(() => {
      assertFalse(true);
    }).toThrow("Expected boolean true to be boolean false.");
  });

  it("should fail when value is falsy but not false", () => {
    expect(() => {
      assertFalse(0);
    }).toThrow("Expected number 0 to be boolean false.");
    expect(() => {
      assertFalse("");
    }).toThrow('Expected string "" to be boolean false.');
    expect(() => {
      assertFalse(null);
    }).toThrow("Expected null to be boolean false.");
    expect(() => {
      assertFalse(undefined);
    }).toThrow("Expected undefined to be boolean false.");
  });

  it("should fail when value is truthy", () => {
    expect(() => {
      assertFalse(1);
    }).toThrow("Expected number 1 to be boolean false.");
    expect(() => {
      assertFalse("false");
    }).toThrow('Expected string "false" to be boolean false.');
    expect(() => {
      assertFalse({});
    }).toThrow("Expected object {} to be boolean false.");
  });

  it("should accept custom message", () => {
    expect(() => {
      assertFalse(true, "Custom error message");
    }).toThrow("Custom error message");
  });
});
