import { describe, expect, it } from "vitest";
import { assertNumberToNearest } from "./number-to-nearest.assert.js";

describe("number-to-nearest", () => {
  it("does not throw when value rounds to expected", () => {
    expect(() => {
      assertNumberToNearest(12.3, 1, 12);
    }).not.toThrow();
  });

  it("rounds to nearest 10", () => {
    expect(() => {
      assertNumberToNearest(47, 10, 50);
    }).not.toThrow();
    expect(() => {
      assertNumberToNearest(43, 10, 40);
    }).not.toThrow();
  });

  it("rounds to nearest 0.1", () => {
    expect(() => {
      assertNumberToNearest(1.234, 0.1, 1.2);
    }).not.toThrow();

    expect(() => {
      assertNumberToNearest(1.267, 0.1, 1.3);
    }).not.toThrow();
  });

  it("rounds to nearest 5", () => {
    expect(() => {
      assertNumberToNearest(7, 5, 5);
    }).not.toThrow();

    expect(() => {
      assertNumberToNearest(8, 5, 10);
    }).not.toThrow();
  });

  it("throws when rounded value does not match expected", () => {
    expect(() => {
      assertNumberToNearest(47, 10, 40);
    }).toThrowError(
      "Expected to equal 40 to nearest 10, got 47 rounding to 50.",
    );
  });

  it("throws with custom message", () => {
    expect(() => {
      assertNumberToNearest(47, 10, 40, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("handles exact values", () => {
    expect(() => {
      assertNumberToNearest(50, 10, 50);
    }).not.toThrow();
  });

  it("handles negative numbers", () => {
    expect(() => {
      assertNumberToNearest(-47, 10, -50);
    }).not.toThrow();
    expect(() => {
      assertNumberToNearest(-43, 10, -40);
    }).not.toThrow();
  });

  it("throws when value is not a number", () => {
    expect(() => {
      assertNumberToNearest("47", 10, 50);
    }).toThrowError('Expected string "47" to be of type number.');
  });
});
