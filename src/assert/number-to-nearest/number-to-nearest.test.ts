import { describe, expect, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertNumberToNearest } from "./number-to-nearest.assert.js";
import { numberToNearest } from "./number-to-nearest.match.js";

describe("number-to-nearest", () => {
  describe("assertNumberToNearest", () => {
    it("does not throw when value rounds to expected", () => {
      expect(() => {
        assertNumberToNearest(12.3, 1, 12);
      }).not.toThrow();
    });

    it("rounds to nearest 10", () => {
      expect(() => {
        assertNumberToNearest(47, 10, 50);
      }).not.toThrow();
      expect(() => {
        assertNumberToNearest(43, 10, 40);
      }).not.toThrow();
    });

    it("rounds to nearest 0.1", () => {
      expect(() => {
        assertNumberToNearest(1.234, 0.1, 1.2);
      }).not.toThrow();

      expect(() => {
        assertNumberToNearest(1.267, 0.1, 1.3);
      }).not.toThrow();
    });

    it("rounds to nearest 5", () => {
      expect(() => {
        assertNumberToNearest(7, 5, 5);
      }).not.toThrow();

      expect(() => {
        assertNumberToNearest(8, 5, 10);
      }).not.toThrow();
    });

    it("throws when rounded value does not match expected", () => {
      expect(() => {
        assertNumberToNearest(47, 10, 40);
      }).toThrow("Expected 47 to equal 40 to nearest 10.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertNumberToNearest(47, 10, 40, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("handles exact values", () => {
      expect(() => {
        assertNumberToNearest(50, 10, 50);
      }).not.toThrow();
    });

    it("handles negative numbers", () => {
      expect(() => {
        assertNumberToNearest(-47, 10, -50);
      }).not.toThrow();
      expect(() => {
        assertNumberToNearest(-43, 10, -40);
      }).not.toThrow();
    });

    it("throws when value is not a number", () => {
      expect(() => {
        assertNumberToNearest("47", 10, 50);
      }).toThrow('Expected string "47" to be of type number.');
    });
  });

  describe("numberToNearest", () => {
    it("matches when value rounds to expected", () => {
      const matcher = numberToNearest(1, 12);

      expect(matcher.matches(12.3)).toBe(true);
    });

    it("matches to nearest 10", () => {
      const matcher = numberToNearest(10, 50);

      expect(matcher.matches(47)).toBe(true);
      expect(matcher.matches(43)).toBe(false);
    });

    it("matches to nearest 0.1", () => {
      const matcher = numberToNearest(0.1, 1.2);

      expect(matcher.matches(1.234)).toBe(true);
      expect(matcher.matches(1.267)).toBe(false);
    });

    it("matches to nearest 5", () => {
      const matcher = numberToNearest(5, 10);

      expect(matcher.matches(8)).toBe(true);
      expect(matcher.matches(7)).toBe(false);
    });

    it("matches exact values", () => {
      const matcher = numberToNearest(10, 50);

      expect(matcher.matches(50)).toBe(true);
    });

    it("matches negative numbers", () => {
      const matcher = numberToNearest(10, -50);

      expect(matcher.matches(-47)).toBe(true);
      expect(matcher.matches(-43)).toBe(false);
    });

    it("does not match non-number values", () => {
      const matcher = numberToNearest(10, 50);

      expect(matcher.matches("47")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = numberToNearest(10, 50);

      expect(desc(matcher)).toBe("equal 50 to nearest 10");
    });

    it("represents the matcher", () => {
      const matcher = numberToNearest(10, 50);

      expect(repr(matcher)).toBe("≈₍10₎50");
    });

    it("describes and represents decimal increments", () => {
      const matcher = numberToNearest(0.1, 1.2);

      expect(desc(matcher)).toBe("equal 1.2 to nearest 0.1");
      expect(repr(matcher)).toBe("≈₍0.1₎1.2");
    });
  });
});
