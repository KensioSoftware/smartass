import { describe, expect, expectTypeOf, it } from "vitest";
import { assertGreaterThan } from "./greater-than.assert.js";
import { greaterThan } from "./greater-than.match.js";
import type { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("greater-than", () => {
  describe("with numbers", () => {
    it("does not throw when value is greater", () => {
      expect(() => {
        assertGreaterThan(10, 1);
      }).not.toThrow();
    });

    it("throws when value is equal", () => {
      expect(() => {
        assertGreaterThan(1, 1);
      }).toThrow("Expected number 1 to be greater than number 1.");
    });

    it("throws when value is smaller", () => {
      expect(() => {
        assertGreaterThan(42, 100);
      }).toThrow("Expected number 42 to be greater than number 100.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertGreaterThan(42, 100, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("reports the comparison on the error", () => {
      let error: AssertionError;
      try {
        assertGreaterThan(42, 100);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.actual).toBe(42);
      expect(error.expected).toBe(">100");
    });

    it("works with negative numbers", () => {
      expect(() => {
        assertGreaterThan(-5, -10);
      }).not.toThrow();
      expect(() => {
        assertGreaterThan(-15, -10);
      }).toThrow("Expected number -15 to be greater than number -10.");
    });

    it("works with decimals", () => {
      expect(() => {
        assertGreaterThan(1.51, 1.5);
      }).not.toThrow();
      expect(() => {
        assertGreaterThan(1.5, 1.51);
      }).toThrow();
    });

    it("throws for NaN", () => {
      expect(() => {
        assertGreaterThan(Number.NaN, 1);
      }).toThrow("Expected number NaN to be greater than number 1.");
    });

    it("narrows the value type", () => {
      const elapsed: unknown = 120;

      assertGreaterThan(elapsed, 0);

      expectTypeOf(elapsed).toEqualTypeOf<number | bigint>();
    });
  });

  describe("with bigint", () => {
    it("does not throw when value is greater", () => {
      expect(() => {
        assertGreaterThan(10n, 1n);
      }).not.toThrow();
    });

    it("throws when value is equal", () => {
      expect(() => {
        assertGreaterThan(1n, 1n);
      }).toThrow("Expected bigint 1n to be greater than bigint 1n.");
    });

    it("throws when value is smaller", () => {
      expect(() => {
        assertGreaterThan(0n, 1n);
      }).toThrow("Expected bigint 0n to be greater than bigint 1n.");
    });

    it("compares a bigint against a number", () => {
      expect(() => {
        assertGreaterThan(10n, 1);
      }).not.toThrow();
      expect(() => {
        assertGreaterThan(1n, 10);
      }).toThrow("Expected bigint 1n to be greater than number 10.");
    });
  });

  describe("type checking", () => {
    it("throws when value is not a number or bigint", () => {
      expect(() => {
        assertGreaterThan("5", 1);
      }).toThrow('Expected string "5" to be greater than number 1.');
    });
  });

  describe("greaterThan", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: number | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: 123 } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: greaterThan(100) },
      });

      // Null-chain operator ? is not required after type narrowing.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<number>();
      expect(foo.bar.foobar).toBeTypeOf("number");
    });

    it("matches values above the bound", () => {
      expect(greaterThan(1).isMatch(2)).toBe(true);
    });

    it("does not match the bound itself", () => {
      expect(greaterThan(1).isMatch(1)).toBe(false);
    });

    it("does not match values below the bound", () => {
      expect(greaterThan(1).isMatch(0)).toBe(false);
    });

    it("matches bigint values", () => {
      expect(greaterThan(1n).isMatch(2n)).toBe(true);
      expect(greaterThan(1n).isMatch(0n)).toBe(false);
    });

    it("does not match non-numeric values", () => {
      const matcher = greaterThan(1);
      expect(matcher.isMatch("5")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        expect(desc(greaterThan(10))).toBe("number greater than number 10");
      });

      it("represents the matcher correctly", () => {
        expect(repr(greaterThan(10))).toBe(">10");
      });

      it("describes bigint correctly", () => {
        expect(desc(greaterThan(10n))).toBe("number greater than bigint 10n");
      });

      it("represents bigint correctly", () => {
        expect(repr(greaterThan(10n))).toBe(">10n");
      });
    });
  });
});
