import { describe, expect, expectTypeOf, it } from "vitest";
import { assertLessThanOrEqual } from "./less-than-or-equal.assert.js";
import { lessThanOrEqual } from "./less-than-or-equal.match.js";
import type { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("less-than-or-equal", () => {
  describe("with numbers", () => {
    it("does not throw when value is smaller", () => {
      expect(() => {
        assertLessThanOrEqual(1, 10);
      }).not.toThrow();
    });

    it("does not throw when value is equal", () => {
      expect(() => {
        assertLessThanOrEqual(1, 1);
      }).not.toThrow();
    });

    it("throws when value is greater", () => {
      expect(() => {
        assertLessThanOrEqual(100, 42);
      }).toThrow("Expected number 100 to be less than or equal to number 42.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertLessThanOrEqual(100, 42, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("reports the comparison on the error", () => {
      let error: AssertionError;
      try {
        assertLessThanOrEqual(100, 42);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.actual).toBe(100);
      expect(error.expected).toBe("<=42");
    });

    it("works with negative numbers", () => {
      expect(() => {
        assertLessThanOrEqual(-10, -10);
      }).not.toThrow();
      expect(() => {
        assertLessThanOrEqual(-5, -10);
      }).toThrow("Expected number -5 to be less than or equal to number -10.");
    });

    it("works with decimals", () => {
      expect(() => {
        assertLessThanOrEqual(1.5, 1.5);
      }).not.toThrow();
      expect(() => {
        assertLessThanOrEqual(1.51, 1.5);
      }).toThrow();
    });

    it("throws for NaN", () => {
      expect(() => {
        assertLessThanOrEqual(Number.NaN, 1);
      }).toThrow("Expected number NaN to be less than or equal to number 1.");
    });

    it("narrows the value type", () => {
      const errorRate: unknown = 0;

      assertLessThanOrEqual(errorRate, 0.01);

      expectTypeOf(errorRate).toEqualTypeOf<number | bigint>();
    });
  });

  describe("with bigint", () => {
    it("does not throw when value is smaller", () => {
      expect(() => {
        assertLessThanOrEqual(1n, 10n);
      }).not.toThrow();
    });

    it("does not throw when value is equal", () => {
      expect(() => {
        assertLessThanOrEqual(1n, 1n);
      }).not.toThrow();
    });

    it("throws when value is greater", () => {
      expect(() => {
        assertLessThanOrEqual(10n, 1n);
      }).toThrow("Expected bigint 10n to be less than or equal to bigint 1n.");
    });

    it("compares a bigint against a number", () => {
      expect(() => {
        assertLessThanOrEqual(10n, 10);
      }).not.toThrow();
      expect(() => {
        assertLessThanOrEqual(10n, 1);
      }).toThrow("Expected bigint 10n to be less than or equal to number 1.");
    });
  });

  describe("type checking", () => {
    it("throws when value is not a number or bigint", () => {
      expect(() => {
        assertLessThanOrEqual("5", 10);
      }).toThrow('Expected string "5" to be less than or equal to number 10.');
    });
  });

  describe("lessThanOrEqual", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 123 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: lessThanOrEqual(123) },
      });

      // Null-chain operator ? is not required after type narrowing.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches values below the bound", () => {
      expect(lessThanOrEqual(1).isMatch(0)).toBe(true);
    });

    it("matches the bound itself", () => {
      expect(lessThanOrEqual(1).isMatch(1)).toBe(true);
    });

    it("does not match values above the bound", () => {
      expect(lessThanOrEqual(1).isMatch(2)).toBe(false);
    });

    it("matches bigint values", () => {
      expect(lessThanOrEqual(1n).isMatch(1n)).toBe(true);
      expect(lessThanOrEqual(1n).isMatch(2n)).toBe(false);
    });

    it("does not match non-numeric values", () => {
      const matcher = lessThanOrEqual(1);
      expect(matcher.isMatch("0")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        expect(desc(lessThanOrEqual(10))).toBe(
          "number less than or equal to number 10",
        );
      });

      it("represents the matcher correctly", () => {
        expect(repr(lessThanOrEqual(10))).toBe("<=10");
      });

      it("describes bigint correctly", () => {
        expect(desc(lessThanOrEqual(10n))).toBe(
          "number less than or equal to bigint 10n",
        );
      });

      it("represents bigint correctly", () => {
        expect(repr(lessThanOrEqual(10n))).toBe("<=10n");
      });
    });
  });
});
