import { describe, expect, expectTypeOf, it } from "vitest";
import { assertLessThan } from "./less-than.assert.js";
import { lessThan } from "./less-than.match.js";
import type { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("less-than", () => {
  describe("with numbers", () => {
    it("does not throw when value is smaller", () => {
      expect(() => {
        assertLessThan(1, 10);
      }).not.toThrow();
    });

    it("throws when value is equal", () => {
      expect(() => {
        assertLessThan(1, 1);
      }).toThrow("Expected number 1 to be less than number 1.");
    });

    it("throws when value is greater", () => {
      expect(() => {
        assertLessThan(100, 42);
      }).toThrow("Expected number 100 to be less than number 42.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertLessThan(100, 42, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("reports the comparison on the error", () => {
      let error: AssertionError;
      try {
        assertLessThan(100, 42);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.actual).toBe(100);
      expect(error.expected).toBe("<42");
    });

    it("works with negative numbers", () => {
      expect(() => {
        assertLessThan(-15, -10);
      }).not.toThrow();
      expect(() => {
        assertLessThan(-5, -10);
      }).toThrow("Expected number -5 to be less than number -10.");
    });

    it("works with decimals", () => {
      expect(() => {
        assertLessThan(1.5, 1.51);
      }).not.toThrow();
      expect(() => {
        assertLessThan(1.51, 1.5);
      }).toThrow();
    });

    it("throws for NaN", () => {
      expect(() => {
        assertLessThan(Number.NaN, 1);
      }).toThrow("Expected number NaN to be less than number 1.");
    });

    it("narrows the value type", () => {
      const retrievability: unknown = 0.42;

      assertLessThan(retrievability, 1);

      expectTypeOf(retrievability).toEqualTypeOf<number | bigint>();
    });
  });

  describe("with bigint", () => {
    it("does not throw when value is smaller", () => {
      expect(() => {
        assertLessThan(1n, 10n);
      }).not.toThrow();
    });

    it("throws when value is equal", () => {
      expect(() => {
        assertLessThan(1n, 1n);
      }).toThrow("Expected bigint 1n to be less than bigint 1n.");
    });

    it("throws when value is greater", () => {
      expect(() => {
        assertLessThan(10n, 1n);
      }).toThrow("Expected bigint 10n to be less than bigint 1n.");
    });

    it("compares a bigint against a number", () => {
      expect(() => {
        assertLessThan(1n, 10);
      }).not.toThrow();
      expect(() => {
        assertLessThan(10n, 1);
      }).toThrow("Expected bigint 10n to be less than number 1.");
    });
  });

  describe("type checking", () => {
    it("throws when value is not a number or bigint", () => {
      expect(() => {
        assertLessThan("5", 10);
      }).toThrow('Expected string "5" to be less than number 10.');
    });
  });

  describe("lessThan", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 123 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: lessThan(150) },
      });

      // Null-chain operator ? is not required after type narrowing.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches values below the bound", () => {
      expect(lessThan(1).isMatch(0)).toBe(true);
    });

    it("does not match the bound itself", () => {
      expect(lessThan(1).isMatch(1)).toBe(false);
    });

    it("does not match values above the bound", () => {
      expect(lessThan(1).isMatch(2)).toBe(false);
    });

    it("matches bigint values", () => {
      expect(lessThan(1n).isMatch(0n)).toBe(true);
      expect(lessThan(1n).isMatch(2n)).toBe(false);
    });

    it("does not match non-numeric values", () => {
      const matcher = lessThan(1);
      expect(matcher.isMatch("0")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        expect(desc(lessThan(10))).toBe("number less than number 10");
      });

      it("represents the matcher correctly", () => {
        expect(repr(lessThan(10))).toBe("<10");
      });

      it("describes bigint correctly", () => {
        expect(desc(lessThan(10n))).toBe("number less than bigint 10n");
      });

      it("represents bigint correctly", () => {
        expect(repr(lessThan(10n))).toBe("<10n");
      });
    });
  });
});
