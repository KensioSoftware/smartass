import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeString } from "./type-string.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeString } from "./type-string.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-string", () => {
  describe("assertTypeString", () => {
    it("throws when value is not a string", () => {
      expect(() => {
        assertTypeString(123);
      }).toThrow("Expected number 123 to be of type string.");
    });

    it("does not throw when value is a string", () => {
      expect(() => {
        assertTypeString("hello");
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeString(123, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-string types", () => {
      expect(() => {
        assertTypeString(null);
      }).toThrow("Expected null to be of type string.");
      expect(() => {
        assertTypeString(undefined);
      }).toThrow("Expected undefined to be of type string.");
      expect(() => {
        assertTypeString(true);
      }).toThrow("Expected boolean true to be of type string.");
      expect(() => {
        assertTypeString({});
      }).toThrow("Expected object {} to be of type string.");
    });

    it("accurately narrows type", () => {
      interface Foo {
        bar?: { foobar?: "hello" | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: "hello" } };
      }

      const foo = getFoo();

      assertTypeString(foo.bar?.foobar);
      expectTypeOf(foo.bar.foobar).toExtend<string>();
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<"hello">();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expect(foo.bar.foobar).toBeTypeOf("string");
      expect(foo.bar.foobar).toBe("hello");
    });
  });

  describe("typeString", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: "hello" | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: "hello" } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeString() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a string.
      // TypeScript can then infer that foo.bar.foobar is literal "hello".
      expectTypeOf(foo.bar.foobar).toExtend<string>();
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<"hello">();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expect(foo.bar.foobar).toBeTypeOf("string");
      expect(foo.bar.foobar).toBe("hello");
    });

    it("matches string values", () => {
      const matcher = typeString();
      expect(matcher.matches("hello")).toBe(true);
      expect(matcher.matches("")).toBe(true);
      expect(matcher.matches("123")).toBe(true);
    });

    it("does not match non-string values", () => {
      const matcher = typeString();
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeString();
      expect(desc(matcher)).toBe("string");
    });

    it("represents the matcher", () => {
      const matcher = typeString();
      expect(repr(matcher)).toBe("String()");
    });
  });
});
