import { describe, expect, it } from "vitest";
import { assertStringIncludes } from "./string-includes.assert.js";
import { stringIncluding } from "./string-includes.match.js";
import { desc, repr } from "../../describe/describe.js";

describe("string-includes", () => {
  describe("assertStringIncludes", () => {
    it("throws when string does not include substring", () => {
      expect(() => {
        assertStringIncludes("hello world", "foo");
      }).toThrow(
        'Expected string "hello world" to include "foo", but it did not.',
      );
    });

    it("does not throw when string includes substring", () => {
      expect(() => {
        assertStringIncludes("hello world", "world");
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertStringIncludes("hello", "goodbye", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty substring", () => {
      expect(() => {
        assertStringIncludes("hello", "");
      }).not.toThrow();
    });

    it("is case sensitive", () => {
      expect(() => {
        assertStringIncludes("Hello World", "hello");
      }).toThrow(
        'Expected string "Hello World" to include "hello", but it did not.',
      );
    });

    it("works with substring at start", () => {
      expect(() => {
        assertStringIncludes("hello world", "hello");
      }).not.toThrow();
    });

    it("works with substring at end", () => {
      expect(() => {
        assertStringIncludes("hello world", "world");
      }).not.toThrow();
    });

    it("works with substring in middle", () => {
      expect(() => {
        assertStringIncludes("hello world", "o w");
      }).not.toThrow();
    });
  });

  describe("stringIncluding", () => {
    it("matches strings that include substring", () => {
      const matcher = stringIncluding("world");
      expect(matcher.matches("hello world")).toBe(true);
      expect(matcher.matches("world")).toBe(true);
    });

    it("does not match strings that do not include substring", () => {
      const matcher = stringIncluding("foo");
      expect(matcher.matches("bar")).toBe(false);
    });

    it("works with empty substring", () => {
      const matcher = stringIncluding("");
      expect(matcher.matches("hello")).toBe(true);
      expect(matcher.matches("")).toBe(true);
    });

    it("is case sensitive", () => {
      const matcher = stringIncluding("hello");
      expect(matcher.matches("Hello World")).toBe(false);
      expect(matcher.matches("hello world")).toBe(true);
    });

    it("works with substring at start", () => {
      const matcher = stringIncluding("hello");
      expect(matcher.matches("hello world")).toBe(true);
    });

    it("works with substring at end", () => {
      const matcher = stringIncluding("world");
      expect(matcher.matches("hello world")).toBe(true);
    });

    it("works with substring in middle", () => {
      const matcher = stringIncluding("o w");
      expect(matcher.matches("hello world")).toBe(true);
    });

    it("does not match non-string values", () => {
      const matcher = stringIncluding("foo");
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringIncluding("foo");
      expect(desc(matcher)).toBe('string including "foo"');
    });

    it("represents the matcher", () => {
      const matcher = stringIncluding("foobar");
      expect(repr(matcher)).toBe('"*foobar*"');
    });

    it("represents with special characters", () => {
      const matcher = stringIncluding(".");
      expect(repr(matcher)).toBe('"*.*"');
    });
  });
});
