import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeNumber } from "./type-number.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeNumber } from "./type-number.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-number", () => {
  describe("assertTypeNumber", () => {
    it("throws when value is not a number", () => {
      expect(() => {
        assertTypeNumber("123");
      }).toThrow('Expected string "123" to be of type number.');
    });

    it("does not throw when value is a number", () => {
      expect(() => {
        assertTypeNumber(123);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeNumber("123", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-number types", () => {
      expect(() => {
        assertTypeNumber(null);
      }).toThrow("Expected null to be of type number.");
      expect(() => {
        assertTypeNumber(undefined);
      }).toThrow("Expected undefined to be of type number.");
      expect(() => {
        assertTypeNumber(true);
      }).toThrow("Expected boolean true to be of type number.");
      expect(() => {
        assertTypeNumber({});
      }).toThrow("Expected object {} to be of type number.");
    });

    it("works with different number types", () => {
      expect(() => {
        assertTypeNumber(0);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(-1);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(3.14);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(Number.NaN);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(Infinity);
      }).not.toThrow();
    });

    it("narrows unknown values to number", () => {
      const value: unknown = 42;

      assertTypeNumber(value);

      expectTypeOf(value).toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<bigint>();
      expect(value).toBeTypeOf("number");
    });

    it("narrows primitive unions to number", () => {
      function getValue():
        | string
        | number
        | boolean
        | bigint
        | null
        | undefined {
        return 42;
      }

      const value = getValue();

      assertTypeNumber(value);

      expectTypeOf(value).toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<bigint>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("number");
    });

    it("preserves number literal union overlap", () => {
      function getValue(): 1 | 2 | "not number" {
        return 1;
      }

      const value = getValue();

      assertTypeNumber(value);

      expectTypeOf(value).toEqualTypeOf<1 | 2>();
      expectTypeOf(value).toExtend<number>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expect(value).toBeTypeOf("number");
    });
  });

  describe("typeNumber", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 42 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeNumber() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a number.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<bigint>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("preserves number literal union overlap in object matches", () => {
      interface Foo {
        bar?: {
          foobar?: 1 | 2 | "not number" | null;
        };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 1 } };
      }

      // Given an object property whose static type includes number literals
      // and non-number alternatives.
      const foo = getFoo();

      // When the property is matched with the composable number matcher.
      assertObjectMatches(foo, {
        bar: { foobar: typeNumber() },
      });

      // Then the property should keep the known number literal overlap instead
      // of widening to the less precise number type.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<1 | 2>();
      expectTypeOf(foo.bar.foobar).toExtend<number>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<number>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches number values", () => {
      const matcher = typeNumber();
      expect(matcher.matches(123)).toBe(true);
      expect(matcher.matches(0)).toBe(true);
      expect(matcher.matches(-1)).toBe(true);
      expect(matcher.matches(3.14)).toBe(true);
      expect(matcher.matches(Number.NaN)).toBe(true);
      expect(matcher.matches(Infinity)).toBe(true);
    });

    it("does not match non-number values", () => {
      const matcher = typeNumber();
      expect(matcher.matches("123")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeNumber();
      expect(desc(matcher)).toBe("number");
    });

    it("represents the matcher", () => {
      const matcher = typeNumber();
      expect(repr(matcher)).toBe("Number()");
    });
  });
});
