import { describe, expect, it } from "vitest";
import { assertArrayIncludesAll } from "./array-includes-all.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { arrayIncludingAll } from "./array-includes-all.match.js";

describe("array-includes-all", () => {
  it("throws when array does not include all elements", () => {
    expect(() => {
      assertArrayIncludesAll([1, 2, 3], [2, 4]);
    }).toThrow(
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
    }).toThrow("Custom error message");
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
    }).toThrow(
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
    }).toThrow(
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
    }).toThrow(
      'Expected array [{"id":1},{"id":2}] (len 2) to include all of [{"id":1}], but missing [{"id":1}].',
    );
  });

  it("matches arrays including all required elements", () => {
    const matcher = arrayIncludingAll([2, 4]);

    expect(matcher.matches([1, 2, 3, 4])).toBe(true);
  });

  it("matches arrays including all required elements in any order", () => {
    const matcher = arrayIncludingAll([4, 2, 1]);

    expect(matcher.matches([1, 2, 3, 4])).toBe(true);
  });

  it("matches arrays including duplicate required elements when the element exists", () => {
    const matcher = arrayIncludingAll([2, 2, 3]);

    expect(matcher.matches([1, 2, 3])).toBe(true);
  });

  it("does not match arrays missing required elements", () => {
    const matcher = arrayIncludingAll([2, 4]);

    expect(matcher.matches([1, 2, 3])).toBe(false);
  });

  it("does not match non-arrays", () => {
    const matcher = arrayIncludingAll([1]);

    expect(matcher.matches(1)).toBe(false);
    expect(matcher.matches("1")).toBe(false);
    expect(matcher.matches({ 0: 1, length: 1 })).toBe(false);
    expect(matcher.matches(null)).toBe(false);
  });

  it("matches any array when no elements are required", () => {
    const matcher = arrayIncludingAll([]);

    expect(matcher.matches([])).toBe(true);
    expect(matcher.matches([1, 2, 3])).toBe(true);
  });

  it("matches objects using reference equality", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const matcher = arrayIncludingAll([obj1, obj2]);

    expect(matcher.matches([obj1, obj2, { id: 3 }])).toBe(true);
    expect(matcher.matches([{ id: 1 }, obj2])).toBe(false);
  });

  it("describes the arrayIncludingAll matcher", () => {
    const matcher = arrayIncludingAll(["foo", "bar"]);

    expect(desc(matcher)).toBe(
      'array including all of array ["foo","bar"] (len 2)',
    );
    expect(repr(matcher)).toBe('["foo","bar"]');
  });
});
