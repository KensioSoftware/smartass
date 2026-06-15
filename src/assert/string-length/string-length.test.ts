import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringLength } from "./string-length.assert.js";
import { stringOfLength } from "./string-length.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import type { StringOfLength } from "./string-length.type.js";

describe("string-length", () => {
  describe("assertStringLength", () => {
    it("does not throw when string has expected length", () => {
      expect(() => {
        assertStringLength("hello", 5);
      }).not.toThrow();
    });

    it("throws when string has different length", () => {
      expect(() => {
        assertStringLength("hello", 3);
      }).toThrow(
        'Expected string "hello" to have length 3, but it had length 5.',
      );
    });

    it("works with empty string", () => {
      expect(() => {
        assertStringLength("", 0);
      }).not.toThrow();
    });

    it("throws when expecting non-zero length on empty string", () => {
      expect(() => {
        assertStringLength("", 1);
      }).toThrow('Expected string "" to have length 1, but it had length 0.');
    });

    it("throws with custom message", () => {
      expect(() => {
        assertStringLength("hello", 2, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with single character", () => {
      expect(() => {
        assertStringLength("a", 1);
      }).not.toThrow();
    });

    it("throws when expecting single character on multi-character string", () => {
      expect(() => {
        assertStringLength("hello", 1);
      }).toThrow(
        'Expected string "hello" to have length 1, but it had length 5.',
      );
    });

    it("works with exact length match", () => {
      expect(() => {
        assertStringLength("test", 4);
      }).not.toThrow();
    });

    it("counts characters correctly including unicode", () => {
      // Note: JavaScript's .length counts UTF-16 code units, not visual characters
      expect(() => {
        assertStringLength("hi", 2);
      }).not.toThrow();
    });

    it("works with large lengths", () => {
      const longString = "a".repeat(1000);
      expect(() => {
        assertStringLength(longString, 1000);
      }).not.toThrow();
    });

    it("throws when length differs for large strings", () => {
      const longString = "a".repeat(1000);
      expect(() => {
        assertStringLength(longString, 999);
      }).toThrow(
        'Expected string "aaaaaaaaaa...aaaaaaaaaa" to have length 999, but it had length 1000.',
      );
    });

    it("throws when value is not a string", () => {
      expect(() => {
        assertStringLength(123, 3);
      }).toThrow("Expected number 123 to be a string of length 3.");
    });

    it("narrows unknown values to strings of the expected length", () => {
      const value: unknown = "hello";

      assertStringLength(value, 5);

      expectTypeOf(value).toEqualTypeOf<StringOfLength<5>>();
      expectTypeOf(value).toExtend<string>();
      expectTypeOf(value[4]).toEqualTypeOf<string>();
      expectTypeOf(value[5]).toEqualTypeOf<string | undefined>();
      expect(value).toBeTypeOf("string");
      expect(value).toHaveLength(5);
    });

    it("preserves known string type information", () => {
      const value = "hello";

      assertStringLength(value, 5);

      expectTypeOf(value).toEqualTypeOf<"hello" & StringOfLength<5>>();
      expectTypeOf(value).toExtend<string>();
      expectTypeOf(value).toExtend<"hello">();
      expectTypeOf(value[4]).toEqualTypeOf<string>();
      expectTypeOf(value[5]).toEqualTypeOf<string | undefined>();
      expect(value).toBeTypeOf("string");
      expect(value).toHaveLength(5);
    });

    it("narrows unknown values to an empty string for length zero", () => {
      const value: unknown = "";

      assertStringLength(value, 0);

      expectTypeOf(value).toEqualTypeOf<"">();
      expect(value).toBe("");
    });

    it("narrows type for safe indexing", () => {
      const foo = "a".repeat(10);
      assertStringLength(foo, 10);
      const thirdChar = foo[2];
      expect(thirdChar.indexOf("a")).toBe(0);
    });
  });

  describe("stringOfLength", () => {
    it("works as composable matcher", () => {
      interface User {
        id?: string;
        username?: string | null;
      }

      function getUser(): User {
        return { id: "user123", username: "FooUser" };
      }

      const user = getUser();

      assertObjectMatches(user, {
        username: stringOfLength(7),
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows user.username is a string of exactly 7 characters.
      expectTypeOf(user.username).toExtend<string>();
      expectTypeOf(user.username).toEqualTypeOf<StringOfLength<7>>();
      expectTypeOf(user.username[3]).toEqualTypeOf<string>();
      expectTypeOf(user.username[7]).toEqualTypeOf<string | undefined>();
      expect(user.username).toHaveLength(7);
      expect(user.username[3]).toBeTypeOf("string");
      expect(user.username[7]).toBeUndefined();
    });

    it("preserves exact empty-string information in composable matcher", () => {
      interface User {
        username?: string | null;
      }

      function getUser(): User {
        return { username: "" };
      }

      const user = getUser();

      assertObjectMatches(user, {
        username: stringOfLength(0),
      });

      expectTypeOf(user.username).toEqualTypeOf<"">();
      expect(user.username).toBe("");
    });

    it("matches strings with expected length", () => {
      const matcher = stringOfLength(5);
      expect(matcher.matches("hello")).toBe(true);
    });

    it("does not match strings with different length", () => {
      const matcher = stringOfLength(3);
      expect(matcher.matches("hello")).toBe(false);
    });

    it("works with empty string", () => {
      const matcher = stringOfLength(0);
      expect(matcher.matches("")).toBe(true);
    });

    it("does not match non-empty string when expecting empty", () => {
      const matcher = stringOfLength(0);
      expect(matcher.matches("a")).toBe(false);
    });

    it("works with single character", () => {
      const matcher = stringOfLength(1);
      expect(matcher.matches("a")).toBe(true);
    });

    it("does not match multi-character when expecting single", () => {
      const matcher = stringOfLength(1);
      expect(matcher.matches("ab")).toBe(false);
    });

    it("works with large lengths", () => {
      const longString = "a".repeat(1000);
      const matcher = stringOfLength(1000);
      expect(matcher.matches(longString)).toBe(true);
    });

    it("does not match when length differs for large strings", () => {
      const longString = "a".repeat(1000);
      const matcher = stringOfLength(999);
      expect(matcher.matches(longString)).toBe(false);
    });

    it("does not match non-string values", () => {
      const matcher = stringOfLength(5);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches({ length: 5 })).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringOfLength(5);
      expect(desc(matcher)).toBe("string of length 5");
    });

    it("represents the matcher", () => {
      const matcher = stringOfLength(5);
      expect(repr(matcher)).toBe("String(5)");
    });

    it("represents with zero length", () => {
      const matcher = stringOfLength(0);
      expect(repr(matcher)).toBe("String(0)");
    });

    it("works with unicode characters", () => {
      // JavaScript's .length counts UTF-16 code units
      const matcher = stringOfLength(2);
      expect(matcher.matches("你好")).toBe(true);
    });
  });
});
