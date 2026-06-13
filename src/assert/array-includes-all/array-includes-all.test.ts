import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayIncludesAll } from "./array-includes-all.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { arrayIncludingAll } from "./array-includes-all.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("array-includes-all", () => {
  describe("assertArrayIncludesAll", () => {
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

    it("requires duplicate elements in matcher input to appear repeatedly", () => {
      const matcher = arrayIncludingAll([2, 2, 3]);

      expect(matcher.matches([1, 2, 3])).toBe(false);
      expect(matcher.matches([1, 2, 2, 3])).toBe(true);
    });

    it("does not match arrays missing required elements", () => {
      const matcher = arrayIncludingAll([2, 4]);

      expect(matcher.matches([1, 2, 3])).toBe(false);
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

    it("requires duplicate elements in required array to appear repeatedly", () => {
      expect(() => {
        assertArrayIncludesAll([1, 2, 3], [2, 2, 3]);
      }).toThrow(
        "Expected array [1,2,3] (len 3) to include all of [2,2,3], but missing [2].",
      );

      expect(() => {
        assertArrayIncludesAll([1, 2, 2, 3], [2, 2, 3]);
      }).not.toThrow();
    });
  });

  describe("arrayIncludingAll", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: arrayIncludingAll(["a", "b"]) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an array of strings with at least two elements.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        [string, string, ...string[]]
      >();
      expectTypeOf(foo.bar.foobar.includes("a")).toEqualTypeOf<boolean>();
      expect(foo.bar.foobar.includes("a")).toBe(true);
      expectTypeOf(foo.bar.foobar.includes("b")).toEqualTypeOf<boolean>();
      expect(foo.bar.foobar.includes("b")).toBe(true);
      expectTypeOf(foo.bar.foobar.includes("c")).toEqualTypeOf<boolean>();
      expect(foo.bar.foobar.includes("c")).toBe(true);
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

      expect(matcher.matches([1, 2, 2, 3])).toBe(true);
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
      expect(repr(matcher)).toBe('[…,"foo","bar",…]');
    });

    it("handles empty elements array in repr", () => {
      const matcher = arrayIncludingAll([]);

      expect(repr(matcher)).toBe("[…,,…]");
    });

    it("repr shows all elements for arrays with ≤5 elements", () => {
      expect(repr(arrayIncludingAll([1]))).toBe("[…,1,…]");
      expect(repr(arrayIncludingAll([1, 2]))).toBe("[…,1,2,…]");
      expect(repr(arrayIncludingAll([1, 2, 3]))).toBe("[…,1,2,3,…]");
      expect(repr(arrayIncludingAll([1, 2, 3, 4]))).toBe("[…,1,2,3,4,…]");
      expect(repr(arrayIncludingAll([1, 2, 3, 4, 5]))).toBe("[…,1,2,3,4,5,…]");
    });

    it("repr truncates arrays with >5 elements showing first 3 and last 1", () => {
      expect(repr(arrayIncludingAll([1, 2, 3, 4, 5, 6]))).toBe(
        "[…,1,2,3,…,6,…]",
      );
      expect(repr(arrayIncludingAll([1, 2, 3, 4, 5, 6, 7]))).toBe(
        "[…,1,2,3,…,7,…]",
      );
      expect(repr(arrayIncludingAll([1, 2, 3, 4, 5, 6, 7, 8]))).toBe(
        "[…,1,2,3,…,8,…]",
      );
    });

    it("repr shows strings with proper quoting for arrays ≤5 elements", () => {
      expect(repr(arrayIncludingAll(["a", "b"]))).toBe('[…,"a","b",…]');
    });

    it("repr shows strings with proper quoting for truncated arrays", () => {
      expect(repr(arrayIncludingAll(["a", "b", "c", "d", "e", "f"]))).toBe(
        '[…,"a","b","c",…,"f",…]',
      );
    });

    it("repr handles mixed types correctly for arrays ≤5 elements", () => {
      expect(repr(arrayIncludingAll([1, "a", null]))).toBe('[…,1,"a",null,…]');
    });

    it("repr handles mixed types correctly for truncated arrays", () => {
      expect(
        repr(arrayIncludingAll([1, "a", null, true, 2n, Symbol("x")])),
      ).toBe('[…,1,"a",null,…,Symbol(x),…]');
    });

    it("repr handles objects correctly for truncated arrays", () => {
      expect(
        repr(arrayIncludingAll([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }])),
      ).toBe('[…,{"a":1},{"b":2},{"c":3},{"d":4},…]');
    });
  });
});
