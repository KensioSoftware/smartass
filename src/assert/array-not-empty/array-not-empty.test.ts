import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayNotEmpty } from "./array-not-empty.assert.js";
import type { AssertionError } from "../../assertion-error.js";
import { nonEmptyArray } from "./array-not-empty.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("not-empty", () => {
  describe("assertArrayNotEmpty", () => {
    it("throws on empty array", () => {
      let error: AssertionError;
      try {
        assertArrayNotEmpty([]);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.message).toBe(
        "Expected array not to be empty, but it was empty.",
      );
      expect(error.actual).toStrictEqual([]);
      expect(error.expected).toStrictEqual(["..."]);
    });

    it("throws on null", () => {
      expect(() => {
        assertArrayNotEmpty(null);
      }).toThrow("Expected null to be a non-empty array.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertArrayNotEmpty(undefined);
      }).toThrow("Expected undefined to be a non-empty array.");
    });

    it("throws on non-arrays", () => {
      expect(() => {
        assertArrayNotEmpty("abc");
      }).toThrow('Expected string "abc" to be a non-empty array.');
    });

    it("preserves specific array type information when value is already an array", () => {
      const value: ("foo" | "bar")[] = ["foo", "bar"];

      assertArrayNotEmpty(value);

      expectTypeOf(value).toEqualTypeOf<
        ("foo" | "bar")[] & ["foo" | "bar", ...("foo" | "bar")[]]
      >();
      expectTypeOf(value).toExtend<("foo" | "bar")[]>();
      expectTypeOf(value).toExtend<["foo" | "bar", ...("foo" | "bar")[]]>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows unknown values to a non-empty array", () => {
      const value: unknown = ["foo", "bar"];

      assertArrayNotEmpty(value);

      expectTypeOf(value).toEqualTypeOf<[unknown, ...unknown[]]>();
      expectTypeOf(value).toExtend<unknown[]>();
      expect(value).toBeTypeOf("object");
    });
  });

  describe("nonEmptyArray", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: nonEmptyArray() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an array of at least 1 string.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<[string, ...string[]]>();
      expectTypeOf(foo.bar.foobar[0]).toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar[1]).toEqualTypeOf<string | undefined>();
      expect(foo.bar.foobar[0]).toBeTypeOf("string");
      expect(["string", "undefined"]).toContain(typeof foo.bar.foobar[1]);
    });

    it("matches non-empty arrays", () => {
      const matcher = nonEmptyArray();

      expect(matcher.isMatch([1])).toBe(true);
    });

    it("matches arrays with multiple elements", () => {
      const matcher = nonEmptyArray();

      expect(matcher.isMatch([1, 2, 3])).toBe(true);
    });

    it("does not match empty arrays", () => {
      const matcher = nonEmptyArray();

      expect(matcher.isMatch([])).toBe(false);
    });

    it("does not match non-arrays", () => {
      const matcher = nonEmptyArray();

      expect(matcher.isMatch(1)).toBe(false);
      expect(matcher.isMatch("a")).toBe(false);
      expect(matcher.isMatch({ 0: "a", length: 1 })).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the nonEmptyArray matcher", () => {
      const matcher = nonEmptyArray();

      expect(desc(matcher)).toBe("non-empty array");
      expect(repr(matcher)).toBe("[…]");
    });
  });

  it("uses unknown element type when the actual property is unknown", () => {
    interface Foo {
      bar?: unknown;
    }

    function getFoo(): Foo {
      return { bar: ["a", "b", "c"] };
    }

    const foo = getFoo();

    assertObjectMatches(foo, {
      bar: nonEmptyArray(),
    });

    expectTypeOf(foo.bar).toEqualTypeOf<[unknown, ...unknown[]]>();
    expectTypeOf(foo.bar[0]).toEqualTypeOf<unknown>();
    expectTypeOf(foo.bar[1]).toEqualTypeOf<unknown>();
    expect(foo.bar[0]).toBe("a");
  });

  it("matches non-empty arrays", () => {
    const matcher = nonEmptyArray();

    expect(matcher.isMatch([1])).toBe(true);
  });
});
