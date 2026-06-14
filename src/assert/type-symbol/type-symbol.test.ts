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

    it("matches symbol values", () => {
      const matcher = typeSymbol();
      expect(matcher.matches(Symbol("foo"))).toBe(true);
      expect(matcher.matches(Symbol("bar"))).toBe(true);
    });

    it("does not match non-symbol values", () => {
      const matcher = typeSymbol();
      expect(matcher.matches("foobar")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches({})).toBe(false);
      expect(matcher.matches([])).toBe(false);
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
