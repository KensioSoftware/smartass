import { describe, expect, it } from "vitest";
import { assertArrayMinLength } from "./array-min-length.assert.js";

describe("array-min-length", () => {
  it("throws when array is shorter than minimum length", () => {
    expect(() => {
      assertArrayMinLength([1, 2], 3);
    }).toThrowError(
      "Expected array [1,2] (len 2) to have at least 3 elements, but it had 2.",
    );
  });

  it("does not throw when array has exactly the minimum length", () => {
    expect(() => {
      assertArrayMinLength([1, 2, 3], 3);
    }).not.toThrow();
  });

  it("does not throw when array exceeds the minimum length", () => {
    expect(() => {
      assertArrayMinLength([1, 2, 3, 4, 5], 3);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayMinLength([1], 5, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with empty arrays and minimum 0", () => {
    expect(() => {
      assertArrayMinLength([], 0);
    }).not.toThrow();
    expect(() => {
      assertArrayMinLength([], 1);
    }).toThrowError(
      "Expected array [] (len 0) to have at least 1 elements, but it had 0.",
    );
  });

  it("throws on null", () => {
    expect(() => {
      assertArrayMinLength(null, 1);
    }).toThrowError("Expected null not to be null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertArrayMinLength(undefined, 1);
    }).toThrowError("Expected undefined not to be undefined.");
  });

  it("works with different minimum lengths", () => {
    expect(() => {
      assertArrayMinLength([1], 1);
    }).not.toThrow();
    expect(() => {
      assertArrayMinLength([1, 2], 2);
    }).not.toThrow();
    expect(() => {
      assertArrayMinLength([1, 2, 3, 4, 5], 5);
    }).not.toThrow();
    expect(() => {
      assertArrayMinLength([1, 2, 3, 4, 5, 6], 6);
    }).not.toThrow();
    expect(() => {
      assertArrayMinLength([1, 2, 3, 4, 5, 6], 3);
    }).not.toThrow();
  });
});
