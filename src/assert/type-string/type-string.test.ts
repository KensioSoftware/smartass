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

    it("narrows unknown values to string", () => {
      const value: unknown = "hello";

      assertTypeString(value);

      expectTypeOf(value).toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expect(value).toBeTypeOf("string");
    });

    it("narrows primitive unions to string", () => {
      function getValue():
        string | number | boolean | bigint | null | undefined {
        return "hello";
      }

      const value = getValue();

      assertTypeString(value);

      expectTypeOf(value).toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<bigint>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("string");
    });

    it("preserves string literal union overlap", () => {
      function getValue(): "hello" | "world" | 123 | null {
        return "hello";
      }

      const value = getValue();

      assertTypeString(value);

      expectTypeOf(value).toEqualTypeOf<"hello" | "world">();
      expectTypeOf(value).toExtend<string>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expect(value).toBeTypeOf("string");
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

    it("preserves string literal union overlap in object matches", () => {
      interface Foo {
        bar?: {
          foobar?: "hello" | "world" | 123 | null;
        };
      }

      function getFoo(): Foo {
        return { bar: { foobar: "hello" } };
      }

      // Given an object property whose static type includes string literals
      // and non-string alternatives.
      const foo = getFoo();

      // When the property is matched with the composable string matcher.
      assertObjectMatches(foo, {
        bar: { foobar: typeString() },
      });

      // Then the property should keep the known string literal overlap instead
      // of widening to the less precise string type.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<"hello" | "world">();
      expectTypeOf(foo.bar.foobar).toExtend<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<number>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("string");
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
