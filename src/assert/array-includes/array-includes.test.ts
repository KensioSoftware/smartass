import { describe, expect, it } from "vitest";
import { assertArrayIncludes } from "./array-includes.assert.js";

describe("array-includes", () => {
  it("throws when array does not include element", () => {
    expect(() => {
      assertArrayIncludes([1, 2, 3], 4);
    }).toThrowError(
      "Expected array [1,2,3] (len 3) to include number 4, but it did not.",
    );
  });

  it("does not throw when array includes element", () => {
    expect(() => {
      assertArrayIncludes([1, 2, 3], 2);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayIncludes([1, 2, 3], 5, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with strings", () => {
    expect(() => {
      assertArrayIncludes(["foo", "bar", "baz"], "bar");
    }).not.toThrow();

    expect(() => {
      assertArrayIncludes(["foo", "bar", "baz"], "qux");
    }).toThrowError(
      'Expected array ["foo","bar","baz"] (len 3) to include string "qux", but it did not.',
    );
  });

  it("works with element at start", () => {
    expect(() => {
      assertArrayIncludes([1, 2, 3], 1);
    }).not.toThrow();
  });

  it("works with element at end", () => {
    expect(() => {
      assertArrayIncludes([1, 2, 3], 3);
    }).not.toThrow();
  });

  it("works with element in middle", () => {
    expect(() => {
      assertArrayIncludes([1, 2, 3], 2);
    }).not.toThrow();
  });

  it("works with objects using reference equality", () => {
    const obj = { id: 1 };
    expect(() => {
      assertArrayIncludes([obj, { id: 2 }], obj);
    }).not.toThrow();

    expect(() => {
      assertArrayIncludes([{ id: 1 }, { id: 2 }], { id: 1 });
    }).toThrowError(
      'Expected array [{"id":1},{"id":2}] (len 2) to include object {"id":1}, but it did not.',
    );
  });
});
