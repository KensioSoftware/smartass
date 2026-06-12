import { describe, expect, it } from "vitest";
import { assertTypeObject } from "./type-object.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeObject } from "./type-object.match.js";

describe("type-object", () => {
  describe("assertTypeObject", () => {
    it("throws when value is not an object", () => {
      expect(() => {
        assertTypeObject("not an object");
      }).toThrow('Expected string "not an object" to be of type object.');
    });

    it("does not throw when value is an object", () => {
      expect(() => {
        assertTypeObject({});
      }).not.toThrow();
      expect(() => {
        assertTypeObject({ key: "value" });
      }).not.toThrow();
      expect(() => {
        assertTypeObject([]);
      }).not.toThrow();
      expect(() => {
        assertTypeObject(null);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeObject(123, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-object types", () => {
      expect(() => {
        assertTypeObject(undefined);
      }).toThrow("Expected undefined to be of type object.");
      expect(() => {
        assertTypeObject(true);
      }).toThrow("Expected boolean true to be of type object.");
      expect(() => {
        assertTypeObject(123);
      }).toThrow("Expected number 123 to be of type object.");
      expect(() => {
        assertTypeObject("foobar");
      }).toThrow('Expected string "foobar" to be of type object.');
    });
  });

  describe("typeObject", () => {
    it("matches object values", () => {
      const matcher = typeObject();
      expect(matcher.matches({})).toBe(true);
      expect(matcher.matches({ key: "value" })).toBe(true);
      expect(matcher.matches([])).toBe(true);
    });

    it("does not match non-object values", () => {
      const matcher = typeObject();
      expect(matcher.matches("not an object")).toBe(false);
      expect(matcher.matches(null)).toBe(true); // wat
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeObject();
      expect(desc(matcher)).toBe("object");
    });

    it("represents the matcher", () => {
      const matcher = typeObject();
      expect(repr(matcher)).toBe("Object()");
    });
  });
});
