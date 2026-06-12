import { describe, expect, it } from "vitest";
import { assertTypeNumber } from "./type-number.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeNumber } from "./type-number.match.js";

describe("type-number", () => {
  describe("assertTypeNumber", () => {
    it("throws when value is not a number", () => {
      expect(() => {
        assertTypeNumber("123");
      }).toThrow('Expected string "123" to be of type number.');
    });

    it("does not throw when value is a number", () => {
      expect(() => {
        assertTypeNumber(123);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeNumber("123", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-number types", () => {
      expect(() => {
        assertTypeNumber(null);
      }).toThrow("Expected null to be of type number.");
      expect(() => {
        assertTypeNumber(undefined);
      }).toThrow("Expected undefined to be of type number.");
      expect(() => {
        assertTypeNumber(true);
      }).toThrow("Expected boolean true to be of type number.");
      expect(() => {
        assertTypeNumber({});
      }).toThrow("Expected object {} to be of type number.");
    });

    it("works with different number types", () => {
      expect(() => {
        assertTypeNumber(0);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(-1);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(3.14);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(Number.NaN);
      }).not.toThrow();
      expect(() => {
        assertTypeNumber(Infinity);
      }).not.toThrow();
    });
  });

  describe("typeNumber", () => {
    it("matches number values", () => {
      const matcher = typeNumber();
      expect(matcher.matches(123)).toBe(true);
      expect(matcher.matches(0)).toBe(true);
      expect(matcher.matches(-1)).toBe(true);
      expect(matcher.matches(3.14)).toBe(true);
      expect(matcher.matches(Number.NaN)).toBe(true);
      expect(matcher.matches(Infinity)).toBe(true);
    });

    it("does not match non-number values", () => {
      const matcher = typeNumber();
      expect(matcher.matches("123")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeNumber();
      expect(desc(matcher)).toBe("number");
    });

    it("represents the matcher", () => {
      const matcher = typeNumber();
      expect(repr(matcher)).toBe("Number()");
    });
  });
});
