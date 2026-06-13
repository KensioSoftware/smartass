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
      }).toThrow("Expected null not to be null.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertArrayNotEmpty(undefined);
      }).toThrow("Expected undefined not to be undefined.");
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

      expect(matcher.matches([1])).toBe(true);
    });

    it("matches arrays with multiple elements", () => {
      const matcher = nonEmptyArray();

      expect(matcher.matches([1, 2, 3])).toBe(true);
    });

    it("does not match empty arrays", () => {
      const matcher = nonEmptyArray();

      expect(matcher.matches([])).toBe(false);
    });

    it("does not match non-arrays", () => {
      const matcher = nonEmptyArray();

      expect(matcher.matches(1)).toBe(false);
      expect(matcher.matches("a")).toBe(false);
      expect(matcher.matches({ 0: "a", length: 1 })).toBe(false);
      expect(matcher.matches(null)).toBe(false);
    });

    it("describes the nonEmptyArray matcher", () => {
      const matcher = nonEmptyArray();

      expect(desc(matcher)).toBe("non-empty array");
      expect(repr(matcher)).toBe("[…]");
    });
  });
});
