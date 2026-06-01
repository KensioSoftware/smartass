import { describe, expect, it } from "vitest";
import { assertUndefined } from "./undefined.assert.js";

describe("assertUndefined", () => {
  it("should pass when value is undefined", () => {
    expect(() => {
      assertUndefined(undefined);
    }).not.toThrow();
  });

  it("should fail when value is null", () => {
    expect(() => {
      assertUndefined(null);
    }).toThrow("Expected null to be undefined.");
  });

  it("should fail when value is falsy but not undefined", () => {
    expect(() => {
      assertUndefined(false);
    }).toThrow("Expected boolean false to be undefined.");
    expect(() => {
      assertUndefined(0);
    }).toThrow("Expected number 0 to be undefined.");
    expect(() => {
      assertUndefined("");
    }).toThrow('Expected string "" to be undefined.');
  });

  it("should fail when value is truthy", () => {
    expect(() => {
      assertUndefined(true);
    }).toThrow("Expected boolean true to be undefined.");
    expect(() => {
      assertUndefined(1);
    }).toThrow("Expected number 1 to be undefined.");
    expect(() => {
      assertUndefined("undefined");
    }).toThrow('Expected string "undefined" to be undefined.');
    expect(() => {
      assertUndefined({});
    }).toThrow("Expected object {} to be undefined.");
  });

  it("should accept custom message", () => {
    expect(() => {
      assertUndefined(null, "Custom error message");
    }).toThrow("Custom error message");
  });
});
