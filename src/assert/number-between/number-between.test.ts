import { describe, expect, expectTypeOf, it } from "vitest";
import { assertNumberBetween } from "./number-between.assert.js";
import { numberBetween } from "./number-between.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("number-between", () => {
  describe("with numbers", () => {
    it("does not throw when value is within range", () => {
      expect(() => {
        assertNumberBetween(5, 1, 10);
      }).not.toThrow();
    });

    it("does not throw when value equals min", () => {
      expect(() => {
        assertNumberBetween(1, 1, 10);
      }).not.toThrow();
    });

    it("does not throw when value equals max", () => {
      expect(() => {
        assertNumberBetween(10, 1, 10);
      }).not.toThrow();
    });

    it("throws when value is below min", () => {
      expect(() => {
        assertNumberBetween(0, 1, 10);
      }).toThrow(
        "Expected number 0 to be between number 1 and number 10 inclusive.",
      );
    });

    it("throws when value is above max", () => {
      expect(() => {
        assertNumberBetween(11, 1, 10);
      }).toThrow(
        "Expected number 11 to be between number 1 and number 10 inclusive.",
      );
    });

    it("throws with custom message", () => {
      expect(() => {
        assertNumberBetween(100, 1, 10, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with negative numbers", () => {
      expect(() => {
        assertNumberBetween(-5, -10, 0);
      }).not.toThrow();
      expect(() => {
        assertNumberBetween(-15, -10, 0);
      }).toThrow(
        "Expected number -15 to be between number -10 and number 0 inclusive.",
      );
    });

    it("works with decimals", () => {
      expect(() => {
        assertNumberBetween(1.5, 1, 2);
      }).not.toThrow();
      expect(() => {
        assertNumberBetween(2.1, 1, 2);
      }).toThrow();
    });
  });

  describe("with bigint", () => {
    it("does not throw when value is within range", () => {
      expect(() => {
        assertNumberBetween(5n, 1n, 10n);
      }).not.toThrow();
    });

    it("does not throw when value equals min", () => {
      expect(() => {
        assertNumberBetween(1n, 1n, 10n);
      }).not.toThrow();
    });

    it("does not throw when value equals max", () => {
      expect(() => {
        assertNumberBetween(10n, 1n, 10n);
      }).not.toThrow();
    });

    it("throws when value is below min", () => {
      expect(() => {
        assertNumberBetween(0n, 1n, 10n);
      }).toThrow(
        "Expected bigint 0n to be between bigint 1n and bigint 10n inclusive.",
      );
    });

    it("throws when value is above max", () => {
      expect(() => {
        assertNumberBetween(11n, 1n, 10n);
      }).toThrow(
        "Expected bigint 11n to be between bigint 1n and bigint 10n inclusive.",
      );
    });
  });

  describe("type checking", () => {
    it("throws when value is not a number or bigint", () => {
      expect(() => {
        assertNumberBetween("5", 1, 10);
      }).toThrow(
        'Expected string "5" to be between number 1 and number 10 inclusive.',
      );
    });
  });

  describe("numberBetween", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 123 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: numberBetween(100, 150) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a number.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    describe("with numbers", () => {
      it("matches values within range", () => {
        const matcher = numberBetween(1, 10);
        expect(matcher.isMatch(5)).toBe(true);
      });

      it("matches values equal to min", () => {
        const matcher = numberBetween(1, 10);
        expect(matcher.isMatch(1)).toBe(true);
      });

      it("matches values equal to max", () => {
        const matcher = numberBetween(1, 10);
        expect(matcher.isMatch(10)).toBe(true);
      });

      it("does not match values below min", () => {
        const matcher = numberBetween(1, 10);
        expect(matcher.isMatch(0)).toBe(false);
      });

      it("does not match values above max", () => {
        const matcher = numberBetween(1, 10);
        expect(matcher.isMatch(11)).toBe(false);
      });

      it("works with negative numbers", () => {
        const matcher = numberBetween(-10, 0);
        expect(matcher.isMatch(-5)).toBe(true);
        expect(matcher.isMatch(-15)).toBe(false);
      });

      it("works with decimals", () => {
        const matcher = numberBetween(1, 2);
        expect(matcher.isMatch(1.5)).toBe(true);
        expect(matcher.isMatch(2.1)).toBe(false);
      });
    });

    describe("with bigint", () => {
      it("matches values within range", () => {
        const matcher = numberBetween(1n, 10n);
        expect(matcher.isMatch(5n)).toBe(true);
      });

      it("matches values equal to min", () => {
        const matcher = numberBetween(1n, 10n);
        expect(matcher.isMatch(1n)).toBe(true);
      });

      it("matches values equal to max", () => {
        const matcher = numberBetween(1n, 10n);
        expect(matcher.isMatch(10n)).toBe(true);
      });

      it("does not match values below min", () => {
        const matcher = numberBetween(1n, 10n);
        expect(matcher.isMatch(0n)).toBe(false);
      });

      it("does not match values above max", () => {
        const matcher = numberBetween(1n, 10n);
        expect(matcher.isMatch(11n)).toBe(false);
      });
    });

    describe("type checking", () => {
      it("does not match non-numeric values", () => {
        const matcher = numberBetween(1, 10);
        expect(matcher.isMatch("5")).toBe(false);
        expect(matcher.isMatch(null)).toBe(false);
        expect(matcher.isMatch(undefined)).toBe(false);
      });
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        const matcher = numberBetween(1, 10);
        expect(desc(matcher)).toBe(
          "number between number 1 and number 10 inclusive",
        );
      });

      it("represents the matcher correctly", () => {
        const matcher = numberBetween(1, 10);
        expect(repr(matcher)).toBe("1<>10");
      });

      it("describes bigint correctly", () => {
        const matcher = numberBetween(1n, 10n);
        expect(desc(matcher)).toBe(
          "number between bigint 1n and bigint 10n inclusive",
        );
      });

      it("represents bigint correctly", () => {
        const matcher = numberBetween(1n, 10n);
        expect(repr(matcher)).toBe("1n<>10n");
      });
    });
  });
});
