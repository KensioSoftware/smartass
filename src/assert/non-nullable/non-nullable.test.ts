import { describe, expect, expectTypeOf, it } from "vitest";
import { assertNonNullable } from "./non-nullable.assert.js";
import { nonNullable } from "./non-nullable.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("non-nullable", () => {
  describe("assertNonNullable", () => {
    it("throws on null", () => {
      expect(() => {
        assertNonNullable(null);
      }).toThrow("Expected null not to be null.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertNonNullable(undefined);
      }).toThrow("Expected undefined not to be undefined.");
    });

    it("OK on non-nullable", () => {
      expect(() => {
        assertNonNullable("foobar");
      }).not.toThrow();
    });
  });

  describe("nonNullable", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: { something?: "hello" | null } };
      }

      function getFoo(): Foo {
        return { bar: { foobar: { something: "hello" } } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: { something: nonNullable() } },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar.something is a literal string "hello".
      // expectTypeOf(foo.bar.foobar).toMatchObjectType<{ something: "hello" }>(); // TODO
      expectTypeOf(foo.bar.foobar.something).not.toEqualTypeOf<null>();
      expectTypeOf(foo.bar.foobar.something).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar.something).toEqualTypeOf<"hello">();
      expect(foo.bar.foobar).toStrictEqual({ something: "hello" });
      expect(foo.bar.foobar.something).toBe("hello");
    });

    it("matches non-null and non-undefined values", () => {
      const matcher = nonNullable();

      expect(matcher.matches("foobar")).toBe(true);
      expect(matcher.matches(123)).toBe(true);
      expect(matcher.matches(true)).toBe(true);
      expect(matcher.matches({})).toBe(true);
      expect(matcher.matches([])).toBe(true);
    });

    it("does not match null", () => {
      const matcher = nonNullable();

      expect(matcher.matches(null)).toBe(false);
    });

    it("does not match undefined", () => {
      const matcher = nonNullable();

      expect(matcher.matches(undefined)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = nonNullable();

      expect(desc(matcher)).toBe("non-null defined value");
    });

    it("represents the matcher", () => {
      const matcher = nonNullable();

      expect(repr(matcher)).toBe("NonNullable");
    });
  });
});
