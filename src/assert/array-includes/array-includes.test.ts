import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayIncludes } from "./array-includes.assert.js";
import { arrayIncluding } from "./array-includes.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("array-includes", () => {
  describe("assertArrayIncludes", () => {
    it("throws when array does not include element", () => {
      expect(() => {
        assertArrayIncludes([1, 2, 3], 4);
      }).toThrow(
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
      }).toThrow("Custom error message");
    });

    it("works with strings", () => {
      expect(() => {
        assertArrayIncludes(["foo", "bar", "baz"], "bar");
      }).not.toThrow();

      expect(() => {
        assertArrayIncludes(["foo", "bar", "baz"], "qux");
      }).toThrow(
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
      }).toThrow(
        'Expected array [{"id":1},{"id":2}] (len 2) to include object {"id":1}, but it did not.',
      );
    });

    it("preserves specific array type information when value is already an array", () => {
      const value: ("foo" | "bar")[] = ["foo", "bar"];

      assertArrayIncludes(value, "foo");

      expectTypeOf(value).toEqualTypeOf<
        ("foo" | "bar")[] & ["foo" | "bar", ...unknown[]]
      >();
      expectTypeOf(value).toExtend<("foo" | "bar")[]>();
      expectTypeOf(value).toExtend<["foo" | "bar", ...unknown[]]>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows unknown values to an array including the specified element", () => {
      const value: unknown = ["foo", "bar"];

      assertArrayIncludes(value, "foo");

      expectTypeOf(value).toEqualTypeOf<["foo", ...unknown[]]>();
      expectTypeOf(value).toExtend<unknown[]>();
      expect(value).toBeTypeOf("object");
    });
  });

  describe("arrayIncluding", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, { bar: { foobar: arrayIncluding("b") } });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an array of strings including "b".
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<["b", ...string[]]>();
      expectTypeOf(foo.bar.foobar.includes("b")).toEqualTypeOf<boolean>();
      expect(foo.bar.foobar.includes("b")).toBe(true);
    });

    it("uses the matcher element type when the actual property is unknown", () => {
      interface Foo {
        bar?: unknown;
      }

      function getFoo(): Foo {
        return { bar: ["a", "b", "c"] };
      }

      const foo = getFoo();

      assertObjectMatches(foo, { bar: arrayIncluding("b") });

      expectTypeOf(foo.bar).toEqualTypeOf<["b", ...unknown[]]>();
      expect(foo.bar.includes("b")).toBe(true);
    });

    it("describes the arrayIncluding matcher", () => {
      const matcher = arrayIncluding("foobar");

      expect(desc(matcher)).toBe('array including string "foobar"');
      expect(repr(matcher)).toBe('[…,"foobar",…]');
    });
  });
});
