import { describe, expect, it } from "vitest";
import { assertArrayEqual } from "./array-equal.assert.js";

describe("array-equal", () => {
  it("does not throw when arrays are equal", () => {
    expect(() => {
      assertArrayEqual(["C", "B"], ["C", "B"]);
    }).not.toThrow();
  });

  it("throws when arrays have different values", () => {
    expect(() => {
      assertArrayEqual(["C", "B"], ["C", "A"]);
    }).toThrow(
      'Expected array ["C","B"] (len 2) to equal array ["C","A"] (len 2).',
    );
  });

  it("throws when arrays have different lengths", () => {
    expect(() => {
      assertArrayEqual([1, 2, 3], [1, 2]);
    }).toThrow("Expected array [1,2,3] (len 3) to equal array [1,2] (len 2).");
  });

  it("throws when value is not an array", () => {
    expect(() => {
      assertArrayEqual("not an array", ["not an array"]);
    }).toThrow(
      'Expected string "not an array" to equal array ["not an array"] (len 1).',
    );
  });

  it("works with objects using reference equality", () => {
    const obj = { id: 1 };

    expect(() => {
      assertArrayEqual([obj], [obj]);
    }).not.toThrow();

    expect(() => {
      assertArrayEqual([{ id: 1 }], [{ id: 1 }]);
    }).toThrow(
      'Expected array [{"id":1}] (len 1) to equal array [{"id":1}] (len 1).',
    );
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayEqual([1, 2, 3], [1, 2, 4], "Custom error message");
    }).toThrow("Custom error message");
  });
});
