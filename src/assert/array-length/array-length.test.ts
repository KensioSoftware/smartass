import { describe, expect, it } from "vitest";
import { assertArrayLength } from "./array-length.assert.js";

describe("array-length", () => {
  it("throws when array length does not match", () => {
    expect(() => {
      assertArrayLength([1, 2, 3], 2);
    }).toThrowError(
      "Expected array [1,2,3] (len 3) to have length 2, but it had length 3.",
    );
  });

  it("does not throw when array length matches", () => {
    expect(() => {
      assertArrayLength([1, 2, 3], 3);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayLength([], 1, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with empty arrays", () => {
    expect(() => {
      assertArrayLength([], 0);
    }).not.toThrow();
    expect(() => {
      assertArrayLength([], 1);
    }).toThrowError(
      "Expected array [] (len 0) to have length 1, but it had length 0.",
    );
  });

  it("throws on null", () => {
    expect(() => {
      assertArrayLength(null, 0);
    }).toThrowError("Expected null not to be null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertArrayLength(undefined, 0);
    }).toThrowError("Expected undefined not to be undefined.");
  });

  it("works with different lengths", () => {
    expect(() => {
      assertArrayLength([1], 1);
    }).not.toThrow();
    expect(() => {
      assertArrayLength([1, 2], 2);
    }).not.toThrow();
    expect(() => {
      assertArrayLength([1, 2, 3, 4, 5], 5);
    }).not.toThrow();
    expect(() => {
      assertArrayLength([1, 2, 3, 4, 5, 6], 6);
    }).not.toThrow();
  });
});
