import { describe, expect, it } from "vitest";
import { assertTypeBoolean } from "./type-boolean.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeBoolean } from "./type-boolean.match.js";

describe("type-boolean", () => {
  describe("assertTypeBoolean", () => {
    it("throws when value is not a boolean", () => {
      expect(() => {
        assertTypeBoolean("true");
      }).toThrow('Expected string "true" to be of type boolean.');
    });

    it("does not throw when value is a boolean", () => {
      expect(() => {
        assertTypeBoolean(true);
      }).not.toThrow();
      expect(() => {
        assertTypeBoolean(false);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeBoolean(1, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-boolean types", () => {
      expect(() => {
        assertTypeBoolean(null);
      }).toThrow("Expected null to be of type boolean.");
      expect(() => {
        assertTypeBoolean(undefined);
      }).toThrow("Expected undefined to be of type boolean.");
      expect(() => {
        assertTypeBoolean(1);
      }).toThrow("Expected number 1 to be of type boolean.");
      expect(() => {
        assertTypeBoolean({});
      }).toThrow("Expected object {} to be of type boolean.");
    });
  });

  describe("typeBoolean", () => {
    it("matches boolean values", () => {
      const matcher = typeBoolean();
      expect(matcher.matches(true)).toBe(true);
      expect(matcher.matches(false)).toBe(true);
    });

    it("does not match non-boolean values", () => {
      const matcher = typeBoolean();
      expect(matcher.matches("true")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(1)).toBe(false);
      expect(matcher.matches({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeBoolean();
      expect(desc(matcher)).toBe("boolean");
    });

    it("represents the matcher", () => {
      const matcher = typeBoolean();
      expect(repr(matcher)).toBe("Boolean()");
    });
  });
});
