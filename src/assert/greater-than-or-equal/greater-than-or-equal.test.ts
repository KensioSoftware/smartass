import { describe, expect, expectTypeOf, it } from "vitest";
import { assertGreaterThanOrEqual } from "./greater-than-or-equal.assert.js";
import { greaterThanOrEqual } from "./greater-than-or-equal.match.js";
import type { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("greater-than-or-equal", () => {
  describe("with numbers", () => {
    it("does not throw when value is greater", () => {
      expect(() => {
        assertGreaterThanOrEqual(10, 1);
      }).not.toThrow();
    });

    it("does not throw when value is equal", () => {
      expect(() => {
        assertGreaterThanOrEqual(1, 1);
      }).not.toThrow();
    });

    it("throws when value is smaller", () => {
      expect(() => {
        assertGreaterThanOrEqual(42, 100);
      }).toThrow(
        "Expected number 42 to be greater than or equal to number 100.",
      );
    });

    it("throws with custom message", () => {
      expect(() => {
        assertGreaterThanOrEqual(42, 100, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("reports the comparison on the error", () => {
      let error: AssertionError;
      try {
        assertGreaterThanOrEqual(42, 100);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.actual).toBe(42);
      expect(error.expected).toBe(">=100");
    });

    it("works with negative numbers", () => {
      expect(() => {
        assertGreaterThanOrEqual(-10, -10);
      }).not.toThrow();
      expect(() => {
        assertGreaterThanOrEqual(-15, -10);
      }).toThrow(
        "Expected number -15 to be greater than or equal to number -10.",
      );
    });

    it("works with decimals", () => {
      expect(() => {
        assertGreaterThanOrEqual(1.5, 1.5);
      }).not.toThrow();
      expect(() => {
        assertGreaterThanOrEqual(1.5, 1.51);
      }).toThrow();
    });

    it("throws for NaN", () => {
      expect(() => {
        assertGreaterThanOrEqual(Number.NaN, 1);
      }).toThrow(
        "Expected number NaN to be greater than or equal to number 1.",
      );
    });

    it("narrows the value type", () => {
      const attempts: unknown = 1;

      assertGreaterThanOrEqual(attempts, 1);

      expectTypeOf(attempts).toEqualTypeOf<number | bigint>();
    });
  });

  describe("with bigint", () => {
    it("does not throw when value is greater", () => {
      expect(() => {
        assertGreaterThanOrEqual(10n, 1n);
      }).not.toThrow();
    });

    it("does not throw when value is equal", () => {
      expect(() => {
        assertGreaterThanOrEqual(1n, 1n);
      }).not.toThrow();
    });

    it("throws when value is smaller", () => {
      expect(() => {
        assertGreaterThanOrEqual(0n, 1n);
      }).toThrow(
        "Expected bigint 0n to be greater than or equal to bigint 1n.",
      );
    });

    it("compares a bigint against a number", () => {
      expect(() => {
        assertGreaterThanOrEqual(10n, 10);
      }).not.toThrow();
      expect(() => {
        assertGreaterThanOrEqual(1n, 10);
      }).toThrow(
        "Expected bigint 1n to be greater than or equal to number 10.",
      );
    });
  });

  describe("type checking", () => {
    it("throws when value is not a number or bigint", () => {
      expect(() => {
        assertGreaterThanOrEqual("5", 1);
      }).toThrow(
        'Expected string "5" to be greater than or equal to number 1.',
      );
    });
  });

  describe("greaterThanOrEqual", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 123 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: greaterThanOrEqual(123) },
      });

      // Null-chain operator ? is not required after type narrowing.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches values above the bound", () => {
      expect(greaterThanOrEqual(1).isMatch(2)).toBe(true);
    });

    it("matches the bound itself", () => {
      expect(greaterThanOrEqual(1).isMatch(1)).toBe(true);
    });

    it("does not match values below the bound", () => {
      expect(greaterThanOrEqual(1).isMatch(0)).toBe(false);
    });

    it("matches bigint values", () => {
      expect(greaterThanOrEqual(1n).isMatch(1n)).toBe(true);
      expect(greaterThanOrEqual(1n).isMatch(0n)).toBe(false);
    });

    it("does not match non-numeric values", () => {
      const matcher = greaterThanOrEqual(1);
      expect(matcher.isMatch("5")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        expect(desc(greaterThanOrEqual(10))).toBe(
          "number greater than or equal to number 10",
        );
      });

      it("represents the matcher correctly", () => {
        expect(repr(greaterThanOrEqual(10))).toBe(">=10");
      });

      it("describes bigint correctly", () => {
        expect(desc(greaterThanOrEqual(10n))).toBe(
          "number greater than or equal to bigint 10n",
        );
      });

      it("represents bigint correctly", () => {
        expect(repr(greaterThanOrEqual(10n))).toBe(">=10n");
      });
    });
  });
});
