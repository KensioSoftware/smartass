import { describe, expect, it } from "vitest";
import { assertTrue } from "./true.assert.js";

describe("assertTrue", () => {
  it("should pass when value is true", () => {
    expect(() => {
      assertTrue(true);
    }).not.toThrow();
  });

  it("should fail when value is false", () => {
    expect(() => {
      assertTrue(false);
    }).toThrow("Expected boolean false to be boolean true.");
  });

  it("should fail when value is truthy but not true", () => {
    expect(() => {
      assertTrue(1);
    }).toThrow("Expected number 1 to be boolean true.");
    expect(() => {
      assertTrue("true");
    }).toThrow('Expected string "true" to be boolean true.');
    expect(() => {
      assertTrue({});
    }).toThrow("Expected object {} to be boolean true.");
  });

  it("should fail when value is falsy", () => {
    expect(() => {
      assertTrue(0);
    }).toThrow("Expected number 0 to be boolean true.");
    expect(() => {
      assertTrue("");
    }).toThrow('Expected string "" to be boolean true.');
    expect(() => {
      assertTrue(null);
    }).toThrow("Expected null to be boolean true.");
    expect(() => {
      assertTrue(undefined);
    }).toThrow("Expected undefined to be boolean true.");
  });

  it("should accept custom message", () => {
    expect(() => {
      assertTrue(false, "Custom error message");
    }).toThrow("Custom error message");
  });
});
