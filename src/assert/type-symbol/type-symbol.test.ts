import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeSymbol } from "./type-symbol.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeSymbol } from "./type-symbol.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-symbol", () => {
  describe("assertTypeSymbol", () => {
    it("throws when value is not a symbol", () => {
      expect(() => {
        assertTypeSymbol("foobar");
      }).toThrow('Expected string "foobar" to be of type symbol.');
    });

    it("does not throw when value is a symbol", () => {
      expect(() => {
        assertTypeSymbol(Symbol("foo"));
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeSymbol(123, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-symbol types", () => {
      expect(() => {
        assertTypeSymbol(null);
      }).toThrow("Expected null to be of type symbol.");
      expect(() => {
        assertTypeSymbol(undefined);
      }).toThrow("Expected undefined to be of type symbol.");
      expect(() => {
        assertTypeSymbol(true);
      }).toThrow("Expected boolean true to be of type symbol.");
      expect(() => {
        assertTypeSymbol(123);
      }).toThrow("Expected number 123 to be of type symbol.");
      expect(() => {
        assertTypeSymbol({});
      }).toThrow("Expected object {} to be of type symbol.");
      expect(() => {
        assertTypeSymbol([]);
      }).toThrow("Expected array [] (len 0) to be of type symbol.");
    });

    it("narrows unknown values to symbol", () => {
      const value: unknown = Symbol("foo");

      assertTypeSymbol(value);

      expectTypeOf(value).toEqualTypeOf<symbol>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expect(value).toBeTypeOf("symbol");
    });

    it("narrows primitive unions to symbol", () => {
      function getValue():
        string | number | boolean | symbol | null | undefined {
        return Symbol("foo");
      }

      const value = getValue();

      assertTypeSymbol(value);

      expectTypeOf(value).toEqualTypeOf<symbol>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("symbol");
    });

    it("preserves unique symbol union overlap", () => {
      const first = Symbol("first");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const second = Symbol("second");

      function getValue(): typeof first | typeof second | "not symbol" {
        return first;
      }

      const value = getValue();

      assertTypeSymbol(value);

      expectTypeOf(value).toEqualTypeOf<typeof first | typeof second>();
      expectTypeOf(value).toExtend<symbol>();
      expectTypeOf(value).not.toEqualTypeOf<symbol>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("symbol");
    });
  });

  describe("typeSymbol", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: symbol | null };
      }

      function getFoo(): Foo {
        return {
          bar: {
            foobar: Symbol("test"),
          },
        };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeSymbol() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a symbol.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<symbol>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("symbol");
    });

    it("preserves unique symbol union overlap in object matches", () => {
      const first = Symbol("first");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const second = Symbol("second");

      interface Foo {
        bar?: {
          foobar?: typeof first | typeof second | "not symbol" | null;
        };
      }

      function getFoo(): Foo {
        return { bar: { foobar: first } };
      }

      // Given an object property whose static type includes unique symbols
      // and non-symbol alternatives.
      const foo = getFoo();

      // When the property is matched with the composable symbol matcher.
      assertObjectMatches(foo, {
        bar: { foobar: typeSymbol() },
      });

      // Then the property should keep the known unique symbol overlap instead
      // of widening to the less precise symbol type.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        typeof first | typeof second
      >();
      expectTypeOf(foo.bar.foobar).toExtend<symbol>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<symbol>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("symbol");
    });

    it("matches symbol values", () => {
      const matcher = typeSymbol();
      expect(matcher.isMatch(Symbol("foo"))).toBe(true);
      expect(matcher.isMatch(Symbol("bar"))).toBe(true);
    });

    it("does not match non-symbol values", () => {
      const matcher = typeSymbol();
      expect(matcher.isMatch("foobar")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch(true)).toBe(false);
      expect(matcher.isMatch(123)).toBe(false);
      expect(matcher.isMatch({})).toBe(false);
      expect(matcher.isMatch([])).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeSymbol();
      expect(desc(matcher)).toBe("symbol");
    });

    it("represents the matcher", () => {
      const matcher = typeSymbol();
      expect(repr(matcher)).toBe("Symbol()");
    });
  });
});
