import { describe, expect, it } from "vitest";
import { assertTypeNumber } from "./type-number.assert.js";

describe("type-number", () => {
  it("throws when value is not a number", () => {
    expect(() => {
      assertTypeNumber("123");
    }).toThrowError('Expected string "123" to be of type number.');
  });

  it("does not throw when value is a number", () => {
    expect(() => {
      assertTypeNumber(123);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeNumber("123", "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with various non-number types", () => {
    expect(() => {
      assertTypeNumber(null);
    }).toThrowError("Expected null to be of type number.");
    expect(() => {
      assertTypeNumber(undefined);
    }).toThrowError("Expected undefined to be of type number.");
    expect(() => {
      assertTypeNumber(true);
    }).toThrowError("Expected boolean true to be of type number.");
    expect(() => {
      assertTypeNumber({});
    }).toThrowError("Expected object {} to be of type number.");
  });

  it("works with different number types", () => {
    expect(() => {
      assertTypeNumber(0);
    }).not.toThrow();
    expect(() => {
      assertTypeNumber(-1);
    }).not.toThrow();
    expect(() => {
      assertTypeNumber(3.14);
    }).not.toThrow();
    expect(() => {
      assertTypeNumber(Number.NaN);
    }).not.toThrow();
    expect(() => {
      assertTypeNumber(Infinity);
    }).not.toThrow();
  });
});
