import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringIncludes } from "./string-includes.assert.js";
import { stringIncluding } from "./string-includes.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

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

    it("throws when value is not a string", () => {
      expect(() => {
        assertStringIncludes(123, "foo");
      }).toThrow('Expected number 123 to include "foo", but it did not.');
    });

    it("narrows unknown values to strings including substring", () => {
      const value: unknown = "hello world";

      assertStringIncludes(value, "world");

      expectTypeOf(value).toEqualTypeOf<`${string}world${string}`>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.includes("world")).toBe(true);
    });

    it("preserves overlap detail for existing string unions", () => {
      function getValue(): "hello world" | "goodbye world" | "hello friend" {
        return "hello world";
      }

      const value = getValue();

      assertStringIncludes(value, "hello");

      expectTypeOf(value).toEqualTypeOf<"hello world" | "hello friend">();
      expectTypeOf(value).not.toEqualTypeOf<`${string}hello${string}`>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.includes("hello")).toBe(true);
    });
  });

  describe("stringIncluding", () => {
    it("works as composable matcher", () => {
      interface File {
        name?: string;
        content?: string | null;
      }

      function getFile(): File {
        return {
          name: "document",
          content: "This is a document with keywords",
        };
      }

      const file = getFile();

      assertObjectMatches(file, {
        content: stringIncluding("keywords"),
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows file.content is a string containing "keywords".
      expectTypeOf(file.content).toEqualTypeOf<`${string}keywords${string}`>();
      expectTypeOf(file.content).not.toEqualTypeOf<string>();
      expect(file.content).toBeTypeOf("string");
      expect(file.content.includes("keywords")).toBe(true);
    });

    it("preserves string literal union overlap in composable matcher", () => {
      interface File {
        content?: "hello world" | "goodbye world" | "hello friend" | null;
      }

      function getFile(): File {
        return {
          content: "hello world",
        };
      }

      const file = getFile();

      assertObjectMatches(file, {
        content: stringIncluding("hello"),
      });

      expectTypeOf(file.content).toEqualTypeOf<
        "hello world" | "hello friend"
      >();
      expectTypeOf(file.content).not.toEqualTypeOf<`${string}hello${string}`>();
      expectTypeOf(file.content).not.toEqualTypeOf<string>();
      expect(file.content.includes("hello")).toBe(true);
    });

    it("matches strings that include substring", () => {
      const matcher = stringIncluding("world");
      expect(matcher.isMatch("hello world")).toBe(true);
      expect(matcher.isMatch("world")).toBe(true);
    });

    it("does not match strings that do not include substring", () => {
      const matcher = stringIncluding("foo");
      expect(matcher.isMatch("bar")).toBe(false);
    });

    it("works with empty substring", () => {
      const matcher = stringIncluding("");
      expect(matcher.isMatch("hello")).toBe(true);
      expect(matcher.isMatch("")).toBe(true);
    });

    it("is case sensitive", () => {
      const matcher = stringIncluding("hello");
      expect(matcher.isMatch("Hello World")).toBe(false);
      expect(matcher.isMatch("hello world")).toBe(true);
    });

    it("works with substring at start", () => {
      const matcher = stringIncluding("hello");
      expect(matcher.isMatch("hello world")).toBe(true);
    });

    it("works with substring at end", () => {
      const matcher = stringIncluding("world");
      expect(matcher.isMatch("hello world")).toBe(true);
    });

    it("works with substring in middle", () => {
      const matcher = stringIncluding("o w");
      expect(matcher.isMatch("hello world")).toBe(true);
    });

    it("does not match non-string values", () => {
      const matcher = stringIncluding("foo");
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch(123)).toBe(false);
      expect(matcher.isMatch(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringIncluding("foo");
      expect(desc(matcher)).toBe('string including "foo"');
    });

    it("represents the matcher", () => {
      const matcher = stringIncluding("foobar");
      expect(repr(matcher)).toBe('"…foobar…"');
    });
  });
});
