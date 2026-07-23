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

    it("is OK on non-nullable", () => {
      expect(() => {
        assertNonNullable("foobar");
      }).not.toThrow();
    });

    it("removes null and undefined from known types", () => {
      const value: string | null | undefined = "foobar";

      assertNonNullable(value);

      expectTypeOf(value).toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBe("foobar");
    });

    it("narrows unknown values to a defined value", () => {
      const value: unknown = "foobar";

      assertNonNullable(value);

      expectTypeOf(value).toEqualTypeOf<NonNullable<unknown>>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBe("foobar");
    });

    it("narrows optional chained types", () => {
      const value: { foo?: { bar?: { foobar?: string | null | undefined } } } =
        { foo: { bar: { foobar: "foobar" } } };

      assertNonNullable(value.foo?.bar?.foobar);

      expectTypeOf(value.foo.bar.foobar).toEqualTypeOf<string>();
      expectTypeOf(value.foo.bar.foobar).not.toEqualTypeOf<null>();
      expectTypeOf(value.foo.bar.foobar).not.toEqualTypeOf<undefined>();
      expect(value.foo.bar.foobar).toBeTypeOf("string");
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
      expectTypeOf(foo.bar.foobar).toMatchObjectType<{ something: "hello" }>();
      expectTypeOf(foo.bar.foobar.something).not.toEqualTypeOf<null>();
      expectTypeOf(foo.bar.foobar.something).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar.something).toEqualTypeOf<"hello">();
      expect(foo.bar.foobar).toStrictEqual({ something: "hello" });
      expect(foo.bar.foobar.something).toBe("hello");
    });

    it("matches non-null and non-undefined values", () => {
      const matcher = nonNullable();

      expect(matcher.isMatch("foobar")).toBe(true);
      expect(matcher.isMatch(123)).toBe(true);
      expect(matcher.isMatch(true)).toBe(true);
      expect(matcher.isMatch({})).toBe(true);
      expect(matcher.isMatch([])).toBe(true);
    });

    it("does not match null", () => {
      const matcher = nonNullable();

      expect(matcher.isMatch(null)).toBe(false);
    });

    it("does not match undefined", () => {
      const matcher = nonNullable();

      expect(matcher.isMatch(undefined)).toBe(false);
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
