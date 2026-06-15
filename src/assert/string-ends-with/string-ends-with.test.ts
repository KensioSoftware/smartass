import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringEndsWith } from "./string-ends-with.assert.js";
import { stringEndingWith } from "./string-ends-with.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

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

    it("throws when value is not a string", () => {
      expect(() => {
        assertStringEndsWith(123, "foo");
      }).toThrow('Expected number 123 to end with "foo", but it did not.');
    });

    it("narrows unknown values to strings ending with suffix", () => {
      const value: unknown = "package.json";

      assertStringEndsWith(value, ".json");

      expectTypeOf(value).toEqualTypeOf<`${string}.json`>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.endsWith(".json")).toBe(true);
    });

    it("preserves overlap detail for existing string unions", () => {
      const value: "package.json" | "package.txt" = "package.json";

      assertStringEndsWith(value, ".json");

      expectTypeOf(value).toEqualTypeOf<"package.json">();
      expectTypeOf(value).not.toEqualTypeOf<`${string}.json`>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.endsWith(".json")).toBe(true);
    });
  });

  describe("stringEndingWith", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { filename?: string | null };
      }

      function getFoo(): Foo {
        return { bar: { filename: "foobar.json" } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { filename: stringEndingWith(".json") },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.filename is a string ending with ".json".
      expectTypeOf(foo.bar.filename).toEqualTypeOf<`${string}.json`>();
      expectTypeOf(foo.bar.filename).not.toEqualTypeOf<string>();
      expect(foo.bar.filename).toBeTypeOf("string");
      expect(foo.bar.filename.endsWith(".json")).toBe(true);
    });

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
