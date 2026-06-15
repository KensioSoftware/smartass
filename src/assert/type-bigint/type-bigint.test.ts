import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeBigInt } from "./type-bigint.assert.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { typeBigInt } from "./type-bigint.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-bigint", () => {
  describe("assertTypeBigInt", () => {
    it("should pass for bigint values", () => {
      expect(() => {
        assertTypeBigInt(0n);
      }).not.toThrow();
      expect(() => {
        assertTypeBigInt(42n);
      }).not.toThrow();
      expect(() => {
        assertTypeBigInt(-42n);
      }).not.toThrow();
      expect(() => {
        assertTypeBigInt(100n);
      }).not.toThrow();
    });

    it("should throw AssertionError for non-bigint values", () => {
      expect(() => {
        assertTypeBigInt(42);
      }).toThrow(AssertionError);
      expect(() => {
        assertTypeBigInt("42");
      }).toThrow(AssertionError);
      expect(() => {
        assertTypeBigInt(null);
      }).toThrow(AssertionError);
      expect(() => {
        assertTypeBigInt(undefined);
      }).toThrow(AssertionError);
      expect(() => {
        assertTypeBigInt({});
      }).toThrow(AssertionError);
      expect(() => {
        assertTypeBigInt([]);
      }).toThrow(AssertionError);
      expect(() => {
        assertTypeBigInt(true);
      }).toThrow(AssertionError);
    });

    it("should throw with default error message", () => {
      expect(() => {
        assertTypeBigInt(42);
      }).toThrow("Expected number 42 to be of type bigint.");
    });

    it("should throw with custom error message", () => {
      expect(() => {
        assertTypeBigInt(42, "Custom error");
      }).toThrow("Custom error");
    });

    it("narrows unknown values to bigint", () => {
      const value: unknown = 42n;

      assertTypeBigInt(value);

      expectTypeOf(value).toEqualTypeOf<bigint>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("bigint");
    });

    it("narrows primitive unions to bigint", () => {
      function getValue():
        | string
        | number
        | bigint
        | boolean
        | null
        | undefined {
        return 42n;
      }

      const value = getValue();

      assertTypeBigInt(value);

      expectTypeOf(value).toEqualTypeOf<bigint>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("bigint");
    });

    it("preserves bigint literal union overlap", () => {
      function getValue(): 1n | 2n | "not bigint" {
        return 1n;
      }

      const value = getValue();

      assertTypeBigInt(value);

      expectTypeOf(value).toEqualTypeOf<1n | 2n>();
      expectTypeOf(value).toExtend<bigint>();
      expectTypeOf(value).not.toEqualTypeOf<bigint>();
      expect(value).toBeTypeOf("bigint");
    });
  });

  describe("typeBigInt", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: bigint | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 42n } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeBigInt() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a bigint.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<bigint>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<number>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("bigint");
    });

    it("preserves bigint literal union overlap in object matches", () => {
      interface Foo {
        bar?: { foobar?: 1n | 2n | "not bigint" | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 1n } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeBigInt() },
      });

      expectTypeOf(foo.bar.foobar).toEqualTypeOf<1n | 2n>();
      expectTypeOf(foo.bar.foobar).toExtend<bigint>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<bigint>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("bigint");
    });

    it("matches bigint values", () => {
      const matcher = typeBigInt();
      expect(matcher.matches(0n)).toBe(true);
      expect(matcher.matches(42n)).toBe(true);
      expect(matcher.matches(-42n)).toBe(true);
    });

    it("does not match non-bigint values", () => {
      const matcher = typeBigInt();
      expect(matcher.matches(42)).toBe(false);
      expect(matcher.matches("42")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches({})).toBe(false);
      expect(matcher.matches([])).toBe(false);
      expect(matcher.matches(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeBigInt();
      expect(desc(matcher)).toBe("bigint");
    });

    it("represents the matcher", () => {
      const matcher = typeBigInt();
      expect(repr(matcher)).toBe("BigInt()");
    });
  });
});
