import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeNumeric } from "./type-numeric.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeNumeric } from "./type-numeric.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-numeric", () => {
  describe("assertTypeNumeric", () => {
    it("does not throw for numbers", () => {
      expect(() => {
        assertTypeNumeric(42);
      }).not.toThrow();
      expect(() => {
        assertTypeNumeric(0);
      }).not.toThrow();
      expect(() => {
        assertTypeNumeric(-1.5);
      }).not.toThrow();
    });

    it("does not throw for bigint", () => {
      expect(() => {
        assertTypeNumeric(42n);
      }).not.toThrow();
      expect(() => {
        assertTypeNumeric(0n);
      }).not.toThrow();
      expect(() => {
        assertTypeNumeric(-1n);
      }).not.toThrow();
    });

    it("throws for strings", () => {
      expect(() => {
        assertTypeNumeric("42");
      }).toThrow('Expected string "42" to be of type number or bigint.');
    });

    it("throws for booleans", () => {
      expect(() => {
        assertTypeNumeric(true);
      }).toThrow("Expected boolean true to be of type number or bigint.");
    });

    it("throws for null", () => {
      expect(() => {
        assertTypeNumeric(null);
      }).toThrow("Expected null to be of type number or bigint.");
    });

    it("throws for undefined", () => {
      expect(() => {
        assertTypeNumeric(undefined);
      }).toThrow("Expected undefined to be of type number or bigint.");
    });

    it("throws for objects", () => {
      expect(() => {
        assertTypeNumeric({ foo: 123 });
      }).toThrow('Expected object {"foo":123} to be of type number or bigint.');
    });

    it("throws for arrays", () => {
      expect(() => {
        assertTypeNumeric([1, 2, 3]);
      }).toThrow(
        "Expected array [1,2,3] (len 3) to be of type number or bigint.",
      );
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeNumeric("foo", "Custom error message");
      }).toThrow("Custom error message");
    });
  });

  describe("typeNumeric", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | bigint | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 42 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeNumeric() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a number.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number | bigint>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<number>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<bigint>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches number values", () => {
      const matcher = typeNumeric();
      expect(matcher.matches(42)).toBe(true);
      expect(matcher.matches(0)).toBe(true);
      expect(matcher.matches(-1.5)).toBe(true);
    });

    it("matches bigint values", () => {
      const matcher = typeNumeric();
      expect(matcher.matches(42n)).toBe(true);
      expect(matcher.matches(0n)).toBe(true);
      expect(matcher.matches(-1n)).toBe(true);
    });

    it("does not match non-numeric values", () => {
      const matcher = typeNumeric();
      expect(matcher.matches("42")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeNumeric();
      expect(desc(matcher)).toBe("numeric");
    });

    it("represents the matcher", () => {
      const matcher = typeNumeric();
      expect(repr(matcher)).toBe("Number()|BigInt()");
    });
  });
});
