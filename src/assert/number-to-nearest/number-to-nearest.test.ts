import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertNumberToNearest } from "./number-to-nearest.assert.js";
import { numberToNearest } from "./number-to-nearest.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("number-to-nearest", () => {
  describe("assertNumberToNearest", () => {
    it("does not throw when value rounds to expected", () => {
      expect(() => {
        assertNumberToNearest(12.3, 12, 1);
      }).not.toThrow();
    });

    it("rounds to nearest 10", () => {
      expect(() => {
        assertNumberToNearest(47, 50, 10);
      }).not.toThrow();
      expect(() => {
        assertNumberToNearest(43, 40, 10);
      }).not.toThrow();
    });

    it("rounds to nearest 0.1", () => {
      expect(() => {
        assertNumberToNearest(1.234, 1.2, 0.1);
      }).not.toThrow();

      expect(() => {
        assertNumberToNearest(1.267, 1.3, 0.1);
      }).not.toThrow();
    });

    it("rounds to nearest 5", () => {
      expect(() => {
        assertNumberToNearest(7, 5, 5);
      }).not.toThrow();

      expect(() => {
        assertNumberToNearest(8, 10, 5);
      }).not.toThrow();
    });

    it("throws when rounded value does not match expected", () => {
      expect(() => {
        assertNumberToNearest(47, 40, 10);
      }).toThrow("Expected 47 to equal 40 to nearest 10.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertNumberToNearest(47, 40, 10, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("handles exact values", () => {
      expect(() => {
        assertNumberToNearest(50, 50, 10);
      }).not.toThrow();
    });

    it("handles negative numbers", () => {
      expect(() => {
        assertNumberToNearest(-47, -50, 10);
      }).not.toThrow();
      expect(() => {
        assertNumberToNearest(-43, -40, 10);
      }).not.toThrow();
    });

    it("throws when value is not a number", () => {
      expect(() => {
        assertNumberToNearest("47", 50, 10);
      }).toThrow('Expected string "47" to be of type number.');
    });

    it("narrows unknown values to number", () => {
      const value: unknown = 47;

      assertNumberToNearest(value, 50, 10);

      expectTypeOf(value).toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<bigint>();
      expect(value).toBeTypeOf("number");
    });

    it("removes null and undefined from nullable number values", () => {
      const value: number | null | undefined = 47;

      assertNumberToNearest(value, 50, 10);

      expectTypeOf(value).toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("number");
    });
  });

  describe("numberToNearest", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 47 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: numberToNearest(50, 10) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a number.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches when value rounds to expected", () => {
      const matcher = numberToNearest(12, 1);

      expect(matcher.isMatch(12.3)).toBe(true);
    });

    it("matches to nearest 10", () => {
      const matcher = numberToNearest(50, 10);

      expect(matcher.isMatch(47)).toBe(true);
      expect(matcher.isMatch(43)).toBe(false);
    });

    it("matches to nearest 0.1", () => {
      const matcher = numberToNearest(1.2, 0.1);

      expect(matcher.isMatch(1.234)).toBe(true);
      expect(matcher.isMatch(1.267)).toBe(false);
    });

    it("matches to nearest 5", () => {
      const matcher = numberToNearest(10, 5);

      expect(matcher.isMatch(8)).toBe(true);
      expect(matcher.isMatch(7)).toBe(false);
    });

    it("matches exact values", () => {
      const matcher = numberToNearest(50, 10);

      expect(matcher.isMatch(50)).toBe(true);
    });

    it("matches negative numbers", () => {
      const matcher = numberToNearest(-50, 10);

      expect(matcher.isMatch(-47)).toBe(true);
      expect(matcher.isMatch(-43)).toBe(false);
    });

    it("does not match non-number values", () => {
      const matcher = numberToNearest(50, 10);

      expect(matcher.isMatch("47")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = numberToNearest(50, 10);

      expect(desc(matcher)).toBe("equal 50 to nearest 10");
    });

    it("represents the matcher", () => {
      const matcher = numberToNearest(50, 10);

      expect(repr(matcher)).toBe("≈₍10₎50");
    });

    it("describes and represents decimal increments", () => {
      const matcher = numberToNearest(1.2, 0.1);

      expect(desc(matcher)).toBe("equal 1.2 to nearest 0.1");
      expect(repr(matcher)).toBe("≈₍0.1₎1.2");
    });
  });
});
