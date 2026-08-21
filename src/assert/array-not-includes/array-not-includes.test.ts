import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayNotIncludes } from "./array-not-includes.assert.js";
import { arrayNotIncluding } from "./array-not-includes.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("array-not-includes", () => {
  describe("assertArrayNotIncludes", () => {
    it("throws when array includes element", () => {
      expect(() => {
        assertArrayNotIncludes([1, 2, 3], 2);
      }).toThrow(
        "Expected array [1,2,3] (len 3) not to include number 2, but it did.",
      );
    });

    it("does not throw when array does not include element", () => {
      expect(() => {
        assertArrayNotIncludes([1, 2, 3], 4);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertArrayNotIncludes([1, 2, 3], 3, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("does not throw for an empty array", () => {
      expect(() => {
        assertArrayNotIncludes([], "foo");
      }).not.toThrow();
    });

    it("works with strings", () => {
      expect(() => {
        assertArrayNotIncludes(["foo", "bar", "baz"], "qux");
      }).not.toThrow();

      expect(() => {
        assertArrayNotIncludes(["foo", "bar", "baz"], "bar");
      }).toThrow(
        'Expected array ["foo","bar","baz"] (len 3) not to include string "bar", but it did.',
      );
    });

    it("throws with element at start", () => {
      expect(() => {
        assertArrayNotIncludes([1, 2, 3], 1);
      }).toThrow(
        "Expected array [1,2,3] (len 3) not to include number 1, but it did.",
      );
    });

    it("throws with element at end", () => {
      expect(() => {
        assertArrayNotIncludes([1, 2, 3], 3);
      }).toThrow(
        "Expected array [1,2,3] (len 3) not to include number 3, but it did.",
      );
    });

    it("works with objects using reference equality", () => {
      const object = { id: 1 };

      expect(() => {
        assertArrayNotIncludes([{ id: 1 }, { id: 2 }], object);
      }).not.toThrow();

      expect(() => {
        assertArrayNotIncludes([object, { id: 2 }], object);
      }).toThrow(
        'Expected array [{"id":1},{"id":2}] (len 2) not to include object {"id":1}, but it did.',
      );
    });

    it("throws when value is not an array", () => {
      expect(() => {
        assertArrayNotIncludes("foo", "f");
      }).toThrow(
        'Expected string "foo" to be an array not including string "f".',
      );

      expect(() => {
        assertArrayNotIncludes(undefined, "foo");
      }).toThrow(
        'Expected undefined to be an array not including string "foo".',
      );

      expect(() => {
        assertArrayNotIncludes(new Set(["foo"]), "bar");
      }).toThrow(
        'Expected Set(["foo"]) (size 1) to be an array not including string "bar".',
      );
    });

    it("preserves specific array type information when value is already an array", () => {
      const value: ("foo" | "bar")[] = ["foo", "foo"];

      assertArrayNotIncludes(value, "bar");

      expectTypeOf(value).toEqualTypeOf<("foo" | "bar")[]>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows unknown values to an array", () => {
      const value: unknown = ["foo", "bar"];

      assertArrayNotIncludes(value, "baz");

      expectTypeOf(value).toEqualTypeOf<unknown[]>();
      expectTypeOf(value).toExtend<unknown[]>();
      expect(value).toHaveLength(2);
    });
  });

  describe("arrayNotIncluding", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, { bar: { foobar: arrayNotIncluding("d") } });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an array of strings.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<string[]>();
      expect(foo.bar.foobar.includes("d")).toBe(false);
    });

    it("narrows an unknown property to an array", () => {
      interface Foo {
        bar?: unknown;
      }

      function getFoo(): Foo {
        return { bar: ["a", "b", "c"] };
      }

      const foo = getFoo();

      assertObjectMatches(foo, { bar: arrayNotIncluding("d") });

      expectTypeOf(foo.bar).toEqualTypeOf<unknown[]>();
      expect(foo.bar.includes("d")).toBe(false);
    });

    it("matches arrays that do not include the element", () => {
      const matcher = arrayNotIncluding("foo");
      expect(matcher.isMatch(["bar", "baz"])).toBe(true);
      expect(matcher.isMatch([])).toBe(true);
    });

    it("does not match arrays that include the element", () => {
      const matcher = arrayNotIncluding("foo");
      expect(matcher.isMatch(["foo", "bar"])).toBe(false);
    });

    it("does not match non-array values", () => {
      const matcher = arrayNotIncluding("foo");
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch("bar")).toBe(false);
      expect(matcher.isMatch(new Set(["bar"]))).toBe(false);
    });

    it("describes the arrayNotIncluding matcher", () => {
      const matcher = arrayNotIncluding("foobar");

      expect(desc(matcher)).toBe('array not including string "foobar"');
      expect(repr(matcher)).toBe('[…,✗"foobar"✗,…]');
    });
  });
});
