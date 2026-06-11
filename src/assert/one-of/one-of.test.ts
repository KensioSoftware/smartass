import { describe, expect, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertOneOf } from "./one-of.assert.js";
import { oneOf } from "./one-of.match.js";

describe("one-of", () => {
  describe("assertOneOf", () => {
    it("throws when value is not in allowed list", () => {
      expect(() => {
        assertOneOf("foo", ["bar", "baz"]);
      }).toThrow('Expected string "foo" to be one of ["bar","baz"].');
    });

    it("does not throw when value is in allowed list", () => {
      expect(() => {
        assertOneOf("bar", ["bar", "baz"]);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertOneOf("foo", ["bar", "baz"], "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with numbers", () => {
      expect(() => {
        assertOneOf(1, [1, 2, 3]);
      }).not.toThrow();
      expect(() => {
        assertOneOf(4, [1, 2, 3]);
      }).toThrow("Expected number 4 to be one of [1,2,3].");
    });
  });

  describe("oneOf", () => {
    it("matches when value is in allowed list", () => {
      const matcher = oneOf(["foo", "bar", "baz"]);
      expect(matcher.matches("foo")).toBe(true);
      expect(matcher.matches("bar")).toBe(true);
    });

    it("does not match when value is not in allowed list", () => {
      const matcher = oneOf(["foo", "bar"]);
      expect(matcher.matches("baz")).toBe(false);
    });

    it("works with numbers", () => {
      const matcher = oneOf([1, 2, 3]);
      expect(matcher.matches(1)).toBe(true);
      expect(matcher.matches(4)).toBe(false);
    });

    it("works with bigint", () => {
      const matcher = oneOf([1n, 2n, 3n]);
      expect(matcher.matches(1n)).toBe(true);
      expect(matcher.matches(4n)).toBe(false);
    });

    it("works with boolean values", () => {
      const matcher = oneOf([true, false]);
      expect(matcher.matches(true)).toBe(true);
      expect(matcher.matches(false)).toBe(true);
    });

    it("works with mixed types", () => {
      const matcher = oneOf(["string", 42, true]);
      expect(matcher.matches("string")).toBe(true);
      expect(matcher.matches(42)).toBe(true);
      expect(matcher.matches(true)).toBe(true);
      expect(matcher.matches(null)).toBe(false);
    });

    it("works with undefined", () => {
      const matcher = oneOf(["foo", undefined]);
      expect(matcher.matches(undefined)).toBe(true);
      expect(matcher.matches("bar")).toBe(false);
    });

    it("works with null", () => {
      const matcher = oneOf(["foo", null]);
      expect(matcher.matches(null)).toBe(true);
      expect(matcher.matches("bar")).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = oneOf(["foo", "bar"]);
      expect(desc(matcher)).toBe('one of ["foo","bar"]');
    });

    it("represents the matcher", () => {
      const matcher = oneOf(["foo", "bar"]);
      expect(repr(matcher)).toBe('"foo"|"bar"');
    });

    it("represents with number types", () => {
      const matcher = oneOf([1, 2, 3]);
      expect(repr(matcher)).toBe("1|2|3");
    });

    it("represents with bigint types", () => {
      const matcher = oneOf([1n, 2n]);
      expect(repr(matcher)).toBe("1n|2n");
    });

    it("does not match null values when not in allowed list", () => {
      const matcher = oneOf(["foo", "bar"]);
      expect(matcher.matches(null)).toBe(false);
    });

    it("does not match undefined values when not in allowed list", () => {
      const matcher = oneOf(["foo", "bar"]);
      expect(matcher.matches(undefined)).toBe(false);
    });

    it("matches symbol values", () => {
      const sym1 = Symbol("test");
      const sym2 = Symbol("test");
      const matcher = oneOf([sym1, "foo"]);
      expect(matcher.matches(sym1)).toBe(true);
      expect(matcher.matches(sym2)).toBe(false);
      expect(matcher.matches("foo")).toBe(true);
    });
  });
});
