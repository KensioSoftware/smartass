import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringStartsWith } from "./string-starts-with.assert.js";
import { stringStartingWith } from "./string-starts-with.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { assertNonNullable } from "../non-nullable/non-nullable.assert.js";

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

    it("throws when value is not a string", () => {
      expect(() => {
        assertStringStartsWith(123, "foo");
      }).toThrow('Expected number 123 to be a string starting with "foo".');
    });

    it("narrows unknown values to strings starting with prefix", () => {
      const value: unknown = "package.json";

      assertStringStartsWith(value, "package");

      expectTypeOf(value).toEqualTypeOf<`package${string}`>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.startsWith("package")).toBe(true);
    });

    it("preserves overlap detail for existing string unions", () => {
      function getValue(): "package.json" | "config.json" | "package.txt" {
        return "package.json";
      }

      const value = getValue();

      assertStringStartsWith(value, "package");

      expectTypeOf(value).toEqualTypeOf<"package.json" | "package.txt">();
      expectTypeOf(value).not.toEqualTypeOf<`package${string}`>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.startsWith("package")).toBe(true);
    });

    it("narrows non-nullable broad strings to strings starting with prefix", () => {
      interface CreateHostedZoneOutput {
        readonly HostedZone?: {
          readonly Id?: string | undefined;
        };
      }

      const createHostedZoneOutput: CreateHostedZoneOutput = {
        HostedZone: { Id: "Z123456789" },
      };

      const hostedZoneId = createHostedZoneOutput.HostedZone?.Id;

      assertNonNullable(hostedZoneId);
      assertStringStartsWith(hostedZoneId, "Z");

      expectTypeOf(hostedZoneId).toEqualTypeOf<`Z${string}`>();
      expectTypeOf(hostedZoneId).not.toEqualTypeOf<never>();
      expect(hostedZoneId.startsWith("Z")).toBe(true);
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
      // TypeScript knows foo.bar.filename is a string starting with "foobar".
      expectTypeOf(foo.bar.filename).toEqualTypeOf<`foobar${string}`>();
      expectTypeOf(foo.bar.filename).not.toEqualTypeOf<string>();
      expect(foo.bar.filename).toBeTypeOf("string");
      expect(foo.bar.filename.startsWith("foobar")).toBe(true);
    });

    it("preserves overlap detail for existing string unions in object matches", () => {
      interface Foo {
        bar?: {
          filename?: "package.json" | "config.json" | "package.txt" | null;
        };
      }

      const foo: Foo = {
        bar: {
          filename: "package.json",
        },
      };

      assertObjectMatches(foo, {
        bar: { filename: stringStartingWith("package") },
      });

      expectTypeOf(foo.bar.filename).toEqualTypeOf<
        "package.json" | "package.txt"
      >();
      expectTypeOf(foo.bar.filename).not.toEqualTypeOf<`package${string}`>();
      expectTypeOf(foo.bar.filename).not.toEqualTypeOf<string>();
      expect(foo.bar.filename).toBeTypeOf("string");
      expect(foo.bar.filename.startsWith("package")).toBe(true);
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
