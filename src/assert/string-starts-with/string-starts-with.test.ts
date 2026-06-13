import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringStartsWith } from "./string-starts-with.assert.js";
import { stringStartingWith } from "./string-starts-with.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("string-starts-with", () => {
  describe("assertStringStartsWith", () => {
    it("throws when string does not start with prefix", () => {
      expect(() => {
        assertStringStartsWith("hello world", "foo");
      }).toThrow(
        'Expected string "hello world" to start with "foo", but it did not.',
      );
    });

    it("does not throw when string starts with prefix", () => {
      expect(() => {
        assertStringStartsWith("hello world", "hello");
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertStringStartsWith("hello", "goodbye", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty prefix", () => {
      expect(() => {
        assertStringStartsWith("hello", "");
      }).not.toThrow();
    });

    it("is case sensitive", () => {
      expect(() => {
        assertStringStartsWith("Hello World", "hello");
      }).toThrow(
        'Expected string "Hello World" to start with "hello", but it did not.',
      );
    });

    it("works with exact match", () => {
      expect(() => {
        assertStringStartsWith("hello", "hello");
      }).not.toThrow();
    });

    it("throws when prefix is longer than string", () => {
      expect(() => {
        assertStringStartsWith("hi", "hello");
      }).toThrow('Expected string "hi" to start with "hello", but it did not.');
    });
  });

  describe("stringStartingWith", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { filename?: string | null };
      }

      function getFoo(): Foo {
        return { bar: { filename: "foobar.json" } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { filename: stringStartingWith("foobar") },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.filename is a string ending with ".json".
      expectTypeOf(foo.bar.filename).toEqualTypeOf<`foobar${string}`>();
      expectTypeOf(foo.bar.filename).not.toEqualTypeOf<string>();
      expect(foo.bar.filename).toBeTypeOf("string");
      expect(foo.bar.filename.startsWith("foobar")).toBe(true);
    });

    it("matches strings that start with prefix", () => {
      const matcher = stringStartingWith("hello");
      expect(matcher.matches("hello world")).toBe(true);
      expect(matcher.matches("hello")).toBe(true);
    });

    it("does not match strings that do not start with prefix", () => {
      const matcher = stringStartingWith("foo");
      expect(matcher.matches("bar")).toBe(false);
      expect(matcher.matches("bar-foo")).toBe(false);
      expect(matcher.matches("foobar")).toBe(true);
    });

    it("works with empty prefix", () => {
      const matcher = stringStartingWith("");
      expect(matcher.matches("hello")).toBe(true);
      expect(matcher.matches("")).toBe(true);
    });

    it("is case sensitive", () => {
      const matcher = stringStartingWith("hello");
      expect(matcher.matches("Hello World")).toBe(false);
      expect(matcher.matches("hello world")).toBe(true);
    });

    it("works with exact match", () => {
      const matcher = stringStartingWith("hello");
      expect(matcher.matches("hello")).toBe(true);
    });

    it("works when prefix is longer than string", () => {
      const matcher = stringStartingWith("hello");
      expect(matcher.matches("hi")).toBe(false);
    });

    it("does not match non-string values", () => {
      const matcher = stringStartingWith("foo");
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringStartingWith("foo");
      expect(desc(matcher)).toBe('string starting with "foo"');
    });

    it("represents the matcher", () => {
      const matcher = stringStartingWith("foobar");
      expect(repr(matcher)).toBe('"foobar…"');
    });
  });
});
