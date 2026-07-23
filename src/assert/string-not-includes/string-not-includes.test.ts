import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringNotIncludes } from "./string-not-includes.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { stringNotIncluding } from "./string-not-includes.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("string-not-includes", () => {
  describe("assertStringNotIncludes", () => {
    it("throws when string includes substring", () => {
      expect(() => {
        assertStringNotIncludes("hello world", "world");
      }).toThrow(
        'Expected string "hello world" not to include "world", but it did.',
      );
    });

    it("does not throw when string does not include substring", () => {
      expect(() => {
        assertStringNotIncludes("hello world", "foo");
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertStringNotIncludes("hello", "ell", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("throws with empty substring", () => {
      expect(() => {
        assertStringNotIncludes("hello", "");
      }).toThrow('Expected string "hello" not to include "", but it did.');
    });

    it("is case sensitive", () => {
      expect(() => {
        assertStringNotIncludes("Hello World", "hello");
      }).not.toThrow();
    });

    it("throws with substring at start", () => {
      expect(() => {
        assertStringNotIncludes("hello world", "hello");
      }).toThrow(
        'Expected string "hello world" not to include "hello", but it did.',
      );
    });

    it("throws with substring at end", () => {
      expect(() => {
        assertStringNotIncludes("hello world", "world");
      }).toThrow(
        'Expected string "hello world" not to include "world", but it did.',
      );
    });

    it("throws with substring in middle", () => {
      expect(() => {
        assertStringNotIncludes("hello world", "o w");
      }).toThrow(
        'Expected string "hello world" not to include "o w", but it did.',
      );
    });

    it("throws when value is not a string", () => {
      expect(() => {
        assertStringNotIncludes(123, "foo");
      }).toThrow('Expected number 123 to be a string not including "foo".');
    });

    it("narrows unknown values to strings for non-empty substrings", () => {
      const value: unknown = "hello world";

      assertStringNotIncludes(value, "foo");

      expectTypeOf(value).toEqualTypeOf<
        Exclude<string, `${string}foo${string}`>
      >();
      expectTypeOf(value).toExtend<string>();
      expect(value).toBeTypeOf("string");
      expect(value.includes("foo")).toBe(false);
    });

    it("preserves overlap detail for existing string unions", () => {
      function getValue(): "hello world" | "goodbye world" | "safe text" {
        return "safe text";
      }

      const value = getValue();

      assertStringNotIncludes(value, "hello");

      expectTypeOf(value).toEqualTypeOf<"goodbye world" | "safe text">();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.includes("hello")).toBe(false);
    });

    it("narrows impossible empty-substring assertions to never", () => {
      const value: unknown = "hello";

      expect(() => {
        assertStringNotIncludes(value, "");
      }).toThrow('Expected string "hello" not to include "", but it did.');
    });
  });

  describe("stringNotIncluding", () => {
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
        content: stringNotIncluding("foobar"),
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows file.content is a string containing "keywords".
      expectTypeOf(file.content).toExtend<string>();
      expectTypeOf(file.content).toEqualTypeOf<
        Exclude<string, `${string}foobar${string}`>
      >();
      expect(file.content).toBeTypeOf("string");
      expect(file.content.includes("keywords")).toBe(true);
    });

    it("preserves overlap detail for existing string unions in object matches", () => {
      interface File {
        content?: "hello world" | "goodbye world" | "safe text" | null;
      }

      const file: File = {
        content: "safe text",
      };

      assertObjectMatches(file, {
        content: stringNotIncluding("hello"),
      });

      expectTypeOf(file.content).toEqualTypeOf<"goodbye world" | "safe text">();
      expectTypeOf(file.content).not.toEqualTypeOf<string>();
      expect(file.content).toBeTypeOf("string");
      expect(file.content.includes("hello")).toBe(false);
    });

    it("matches strings that do not include substring", () => {
      const matcher = stringNotIncluding("world");
      expect(matcher.isMatch("hello")).toBe(true);
    });

    it("does not match strings that include substring", () => {
      const matcher = stringNotIncluding("world");
      expect(matcher.isMatch("hello world")).toBe(false);
    });

    it("does not match empty string with non-empty substring", () => {
      const matcher = stringNotIncluding("world");
      expect(matcher.isMatch("")).toBe(true);
    });

    it("does not match when string equals substring", () => {
      const matcher = stringNotIncluding("world");
      expect(matcher.isMatch("world")).toBe(false);
    });

    it("works with empty substring", () => {
      const matcher = stringNotIncluding("");
      expect(matcher.isMatch("hello")).toBe(false);
      expect(matcher.isMatch("")).toBe(false);
    });

    it("is case sensitive", () => {
      const matcher = stringNotIncluding("hello");
      expect(matcher.isMatch("Hello World")).toBe(true);
      expect(matcher.isMatch("hello world")).toBe(false);
    });

    it("works with substring at start", () => {
      const matcher = stringNotIncluding("hello");
      expect(matcher.isMatch("hello world")).toBe(false);
      expect(matcher.isMatch("world hello")).toBe(false);
    });

    it("works with substring at end", () => {
      const matcher = stringNotIncluding("world");
      expect(matcher.isMatch("hello world")).toBe(false);
      expect(matcher.isMatch("world hello")).toBe(false);
    });

    it("does not match non-string values", () => {
      const matcher = stringNotIncluding("foo");
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch(123)).toBe(false);
      expect(matcher.isMatch(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringNotIncluding("foo");
      expect(desc(matcher)).toBe('string not including "foo"');
    });

    it("represents the matcher", () => {
      const matcher = stringNotIncluding("foobar");
      expect(repr(matcher)).toBe('"✗foobar✗"');
    });

    it("represents with special characters", () => {
      const matcher = stringNotIncluding(".");
      expect(repr(matcher)).toBe('"✗.✗"');
    });
  });
});
