import { describe, expect, it } from "vitest";
import { assertArrayMinLength } from "./array-min-length.assert.js";
import { arrayOfMinLength } from "./array-min-length.match.js";
import { desc, repr } from "../../describe/describe.js";

describe("array-min-length", () => {
  it("throws when array is shorter than minimum length", () => {
    expect(() => {
      assertArrayMinLength([1, 2], 3);
    }).toThrow(
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
    }).toThrow("Custom error message");
  });

  it("works with empty arrays and minimum 0", () => {
    expect(() => {
      assertArrayMinLength([], 0);
    }).not.toThrow();
    expect(() => {
      assertArrayMinLength([], 1);
    }).toThrow(
      "Expected array [] (len 0) to have at least 1 elements, but it had 0.",
    );
  });

  it("throws on null", () => {
    expect(() => {
      assertArrayMinLength(null, 1);
    }).toThrow("Expected null not to be null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertArrayMinLength(undefined, 1);
    }).toThrow("Expected undefined not to be undefined.");
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

  it("matches arrays with exactly the minimum length", () => {
    const matcher = arrayOfMinLength(3);

    expect(matcher.matches([1, 2, 3])).toBe(true);
  });

  it("matches arrays longer than the minimum length", () => {
    const matcher = arrayOfMinLength(3);

    expect(matcher.matches([1, 2, 3, 4])).toBe(true);
  });

  it("does not match arrays shorter than the minimum length", () => {
    const matcher = arrayOfMinLength(3);

    expect(matcher.matches([1, 2])).toBe(false);
  });

  it("matches any array when minimum length is zero", () => {
    const matcher = arrayOfMinLength(0);

    expect(matcher.matches([])).toBe(true);
    expect(matcher.matches([1, 2, 3])).toBe(true);
  });

  it("does not match non-arrays", () => {
    const matcher = arrayOfMinLength(1);

    expect(matcher.matches(1)).toBe(false);
    expect(matcher.matches("a")).toBe(false);
    expect(matcher.matches({ 0: "a", length: 1 })).toBe(false);
    expect(matcher.matches(null)).toBe(false);
  });

  it("describes the arrayOfMinLength matcher", () => {
    const matcher = arrayOfMinLength(3);

    expect(desc(matcher)).toBe("array of at least 3 elements");
    expect(repr(matcher)).toBe("Array(>=3)");
  });
});
