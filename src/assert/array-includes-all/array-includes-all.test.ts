import { describe, expect, it } from "vitest";
import { assertArrayIncludesAll } from "./array-includes-all.assert.js";

describe("array-includes-all", () => {
  it("throws when array does not include all elements", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3], [2, 4]);
    }).toThrowError(
      "Expected array [1,2,3] (len 3) to include all of [2,4], but missing [4].",
    );
  });

  it("does not throw when array includes all elements", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3], [2, 3]);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3], [4, 5], "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with elements in different order", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3, 4], [4, 2, 1]);
    }).not.toThrow();
  });

  it("works with non-contiguous elements", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3, 4, 5], [1, 3, 5]);
    }).not.toThrow();
  });

  it("works with strings", () => {
    expect(() => {
      assertArrayIncludesAll(["foo", "bar", "baz"], ["bar", "foo"]);
    }).not.toThrow();

    expect(() => {
      assertArrayIncludesAll(["foo", "bar", "baz"], ["qux", "bar"]);
    }).toThrowError(
      'Expected array ["foo","bar","baz"] (len 3) to include all of ["qux","bar"], but missing ["qux"].',
    );
  });

  it("works with empty required elements array", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3], []);
    }).not.toThrow();
  });

  it("throws with multiple missing elements", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2], [3, 4, 5]);
    }).toThrowError(
      "Expected array [1,2] (len 2) to include all of [3,4,5], but missing [3,4,5].",
    );
  });

  it("works with duplicate elements in required array", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3], [2, 2, 3]);
    }).not.toThrow();
  });

  it("works when value has duplicates", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 2, 3], [2, 3]);
    }).not.toThrow();
  });

  it("works with objects using reference equality", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    expect(() => {
      assertArrayIncludesAll([obj1, obj2, { id: 3 }], [obj1, obj2]);
    }).not.toThrow();

    expect(() => {
      assertArrayIncludesAll([{ id: 1 }, { id: 2 }], [{ id: 1 }]);
    }).toThrowError(
      'Expected array [{"id":1},{"id":2}] (len 2) to include all of [{"id":1}], but missing [{"id":1}].',
    );
  });
});
