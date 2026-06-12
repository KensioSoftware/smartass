import { describe, expect, it } from "vitest";
import { assertUuidV4 } from "./uuid-v4.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { uuidV4 } from "./uuid-v4.match.js";

describe("uuid-v4", () => {
  describe("assertUuidV4", () => {
    it("does not throw when value is a UUID v4", () => {
      expect(() => {
        assertUuidV4("123e4567-e89b-42d3-a456-426614174000");
      }).not.toThrow();
    });

    it("does not throw when value is an uppercase UUID v4", () => {
      expect(() => {
        assertUuidV4("123E4567-E89B-42D3-A456-426614174000");
      }).not.toThrow();
    });

    it("throws when value is not a UUID", () => {
      expect(() => {
        assertUuidV4("not-a-uuid");
      }).toThrow('Expected string "not-a-uuid" to be a UUID v4 string.');
    });

    it("throws when value is a UUID but not v4", () => {
      expect(() => {
        assertUuidV4("123e4567-e89b-12d3-a456-426614174000");
      }).toThrow(
        'Expected string "123e4567-e89b-12d3-a456-426614174000" to be a UUID v4 string.',
      );
    });

    it("throws when value has an invalid variant", () => {
      expect(() => {
        assertUuidV4("123e4567-e89b-42d3-7456-426614174000");
      }).toThrow(
        'Expected string "123e4567-e89b-42d3-7456-426614174000" to be a UUID v4 string.',
      );
    });

    it("throws when value is not a string", () => {
      expect(() => {
        assertUuidV4(123);
      }).toThrow("Expected number 123 to be a UUID v4 string.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertUuidV4("not-a-uuid", "Custom error message");
      }).toThrow("Custom error message");
    });
  });

  describe("uuidV4", () => {
    it("matches UUID v4 values", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123e4567-e89b-42d3-a456-426614174000")).toBe(
        true,
      );
    });

    it("matches uppercase UUID v4 values", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123E4567-E89B-42D3-A456-426614174000")).toBe(
        true,
      );
    });

    it("does not match non-UUID strings", () => {
      const matcher = uuidV4();
      expect(matcher.matches("not-a-uuid")).toBe(false);
    });

    it("does not match UUIDs that are not v4", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123e4567-e89b-12d3-a456-426614174000")).toBe(
        false,
      );
    });

    it("does not match UUIDs with invalid variant", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123e4567-e89b-42d3-7456-426614174000")).toBe(
        false,
      );
    });

    it("does not match non-string values", () => {
      const matcher = uuidV4();
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = uuidV4();
      expect(desc(matcher)).toBe("UUID v4 string");
    });

    it("represents the matcher", () => {
      const matcher = uuidV4();
      expect(repr(matcher)).toBe("uuidV4()");
    });
  });
});
