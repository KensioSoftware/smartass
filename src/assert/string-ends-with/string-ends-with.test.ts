import { describe, expect, it } from "vitest";
import { assertStringEndsWith } from "./string-ends-with.assert.js";
import { stringEndingWith } from "./string-ends-with.match.js";
import { desc, repr } from "../../describe/describe.js";

describe("string-ends-with", () => {
  describe("assertStringEndsWith", () => {
    it("throws when string does not end with suffix", () => {
      expect(() => {
        assertStringEndsWith("hello world", "foo");
      }).toThrow(
        'Expected string "hello world" to end with "foo", but it did not.',
      );
    });

    it("does not throw when string ends with suffix", () => {
      expect(() => {
        assertStringEndsWith("hello world", "world");
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertStringEndsWith("hello", "goodbye", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty suffix", () => {
      expect(() => {
        assertStringEndsWith("hello", "");
      }).not.toThrow();
    });

    it("is case sensitive", () => {
      expect(() => {
        assertStringEndsWith("Hello World", "world");
      }).toThrow(
        'Expected string "Hello World" to end with "world", but it did not.',
      );
    });

    it("works with exact match", () => {
      expect(() => {
        assertStringEndsWith("hello", "hello");
      }).not.toThrow();
    });

    it("throws when suffix is longer than string", () => {
      expect(() => {
        assertStringEndsWith("hi", "hello");
      }).toThrow('Expected string "hi" to end with "hello", but it did not.');
    });
  });

  describe("stringEndingWith", () => {
    it("matches strings that end with suffix", () => {
      const matcher = stringEndingWith("world");
      expect(matcher.matches("hello world")).toBe(true);
      expect(matcher.matches("world")).toBe(true);
    });

    it("does not match strings that do not end with suffix", () => {
      const matcher = stringEndingWith("foo");
      expect(matcher.matches("bar")).toBe(false);
      expect(matcher.matches("foobar")).toBe(false);
    });

    it("works with empty suffix", () => {
      const matcher = stringEndingWith("");
      expect(matcher.matches("hello")).toBe(true);
      expect(matcher.matches("")).toBe(true);
    });

    it("is case sensitive", () => {
      const matcher = stringEndingWith("world");
      expect(matcher.matches("Hello World")).toBe(false);
      expect(matcher.matches("hello world")).toBe(true);
    });

    it("works with exact match", () => {
      const matcher = stringEndingWith("hello");
      expect(matcher.matches("hello")).toBe(true);
    });

    it("works when suffix is longer than string", () => {
      const matcher = stringEndingWith("hello");
      expect(matcher.matches("hi")).toBe(false);
    });

    it("does not match non-string values", () => {
      const matcher = stringEndingWith("foo");
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringEndingWith("foo");
      expect(desc(matcher)).toBe('string ending with "foo"');
    });

    it("represents the matcher", () => {
      const matcher = stringEndingWith("foobar");
      expect(repr(matcher)).toBe('"…foobar"');
    });
  });
});
