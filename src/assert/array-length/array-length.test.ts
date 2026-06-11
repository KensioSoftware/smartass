import { describe, expect, it } from "vitest";
import { assertArrayLength } from "./array-length.assert.js";
import { arrayOfLength } from "./array-length.match.js";
import { desc, repr } from "../../describe/describe.js";

describe("array-length", () => {
  it("throws when array length does not match", () => {
    expect(() => {
      assertArrayLength([1, 2, 3], 2);
    }).toThrow(
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
    }).toThrow("Custom error message");
  });

  it("works with empty arrays", () => {
    expect(() => {
      assertArrayLength([], 0);
    }).not.toThrow();
    expect(() => {
      assertArrayLength([], 1);
    }).toThrow(
      "Expected array [] (len 0) to have length 1, but it had length 0.",
    );
  });

  it("throws on null", () => {
    expect(() => {
      assertArrayLength(null, 0);
    }).toThrow("Expected null not to be null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertArrayLength(undefined, 0);
    }).toThrow("Expected undefined not to be undefined.");
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

  it("matches arrays with the expected length", () => {
    const matcher = arrayOfLength(3);

    expect(matcher.matches([1, 2, 3])).toBe(true);
  });

  it("does not match arrays with a different length", () => {
    const matcher = arrayOfLength(3);

    expect(matcher.matches([1, 2])).toBe(false);
    expect(matcher.matches([1, 2, 3, 4])).toBe(false);
  });

  it("matches empty arrays when expected length is zero", () => {
    const matcher = arrayOfLength(0);

    expect(matcher.matches([])).toBe(true);
    expect(matcher.matches([1])).toBe(false);
  });

  it("does not match non-arrays", () => {
    const matcher = arrayOfLength(1);

    expect(matcher.matches(1)).toBe(false);
    expect(matcher.matches("a")).toBe(false);
    expect(matcher.matches({ 0: "a", length: 1 })).toBe(false);
    expect(matcher.matches(null)).toBe(false);
  });

  it("describes the arrayOfLength matcher", () => {
    const matcher = arrayOfLength(3);

    expect(desc(matcher)).toBe("array of length 3");
    expect(repr(matcher)).toBe("Array(3)");
  });
});
