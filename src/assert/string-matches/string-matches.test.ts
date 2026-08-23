import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringMatches } from "./string-matches.assert.js";
import { stringMatching } from "./string-matches.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

const firehoseKey =
  /^\d{4}\/\d{2}\/\d{2}\/\d{2}\/orders-1-[\d-]{19}-[\da-f-]{36}$/;

describe("string-matches", () => {
  describe("assertStringMatches", () => {
    it("does not throw when string matches pattern", () => {
      expect(() => {
        assertStringMatches("hello world", /^hello/);
      }).not.toThrow();
    });

    it("throws when string does not match pattern", () => {
      expect(() => {
        assertStringMatches("hello world", /^goodbye/);
      }).toThrow(
        'Expected string "hello world" to match /^goodbye/, but it did not.',
      );
    });

    it("throws with custom message", () => {
      expect(() => {
        assertStringMatches("hello", /^goodbye/, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("throws when value is not a string", () => {
      expect(() => {
        assertStringMatches(123, /^\d+$/);
      }).toThrow(
        String.raw`Expected number 123 to be a string matching /^\d+$/.`,
      );
    });

    it("matches anywhere in the string when the pattern is unanchored", () => {
      expect(() => {
        assertStringMatches("hello world", /o w/);
      }).not.toThrow();
    });

    it("honours the pattern's flags", () => {
      expect(() => {
        assertStringMatches("Hello World", /hello/i);
      }).not.toThrow();

      expect(() => {
        assertStringMatches("Hello World", /hello/);
      }).toThrow(
        'Expected string "Hello World" to match /hello/, but it did not.',
      );
    });

    // A global pattern carries lastIndex between RegExp.test() calls, so a
    // pattern held in a constant and asserted more than once would otherwise
    // pass and fail in turn.
    it("asserts consistently with a global pattern", () => {
      const pattern = /^\d{4}$/g;

      expect(() => {
        assertStringMatches("2026", pattern);
        assertStringMatches("2026", pattern);
        assertStringMatches("2026", pattern);
      }).not.toThrow();

      expect(pattern.lastIndex).toBe(0);
    });

    it("matches a sticky pattern from the start of the string", () => {
      expect(() => {
        assertStringMatches("orders-1", /orders/y);
      }).not.toThrow();

      expect(() => {
        assertStringMatches("2026/orders-1", /orders/y);
      }).toThrow(
        'Expected string "2026/orders-1" to match /orders/y, but it did not.',
      );
    });

    it("asserts the shape of a key that has no fixed prefix", () => {
      expect(() => {
        assertStringMatches(
          "2026/08/23/14/orders-1-2026-08-23-14-30-00-2f6b6c05-f504-f5d9-f082-f98e93b6d8f0",
          firehoseKey,
        );
      }).not.toThrow();
    });

    it("narrows unknown values to strings", () => {
      const value: unknown = "hello world";

      assertStringMatches(value, /^hello/);

      expectTypeOf(value).toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
      expect(value.startsWith("hello")).toBe(true);
    });

    // A pattern has no type-level shape to test the literals against, so every
    // literal in the union survives the assertion.
    it("keeps a string literal union as it was", () => {
      function getValue(): "2026-08-23" | "not a date" {
        return "2026-08-23";
      }

      const value = getValue();

      assertStringMatches(value, /^\d{4}-\d{2}-\d{2}$/);

      expectTypeOf(value).toEqualTypeOf<"2026-08-23" | "not a date">();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
    });
  });

  describe("stringMatching", () => {
    it("works as composable matcher", () => {
      interface Delivery {
        key?: string | null;
      }

      function getDelivery(): Delivery {
        return { key: "2026/08/23/14/orders-1" };
      }

      const delivery = getDelivery();

      assertObjectMatches(delivery, {
        key: stringMatching(/^\d{4}\/\d{2}\/\d{2}\//),
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows delivery.key is a string.
      expectTypeOf(delivery.key).toEqualTypeOf<string>();
      expect(delivery.key).toBeTypeOf("string");
      expect(delivery.key.startsWith("2026/")).toBe(true);
    });

    it("keeps a string literal union in composable matcher", () => {
      interface Delivery {
        key?: "2026-08-23" | "not a date" | null;
      }

      function getDelivery(): Delivery {
        return { key: "2026-08-23" };
      }

      const delivery = getDelivery();

      assertObjectMatches(delivery, {
        key: stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      });

      expectTypeOf(delivery.key).toEqualTypeOf<"2026-08-23" | "not a date">();
      expectTypeOf(delivery.key).not.toEqualTypeOf<string>();
      expect(delivery.key).toBeTypeOf("string");
    });

    it("reports the mismatch when a property does not match", () => {
      expect(() => {
        assertObjectMatches(
          { key: "not a date" },
          { key: stringMatching(/^\d{4}-\d{2}-\d{2}$/) },
        );
      }).toThrow(String.raw`Mismatch at $.key: expected /^\d{4}-\d{2}-\d{2}$/`);
    });

    it("matches strings that match the pattern", () => {
      const matcher = stringMatching(/^hello/);
      expect(matcher.isMatch("hello world")).toBe(true);
      expect(matcher.isMatch("hello")).toBe(true);
    });

    it("does not match strings that do not match the pattern", () => {
      const matcher = stringMatching(/^hello/);
      expect(matcher.isMatch("goodbye world")).toBe(false);
    });

    it("matches consistently with a global pattern", () => {
      const pattern = /^\d{4}$/g;
      const matcher = stringMatching(pattern);

      expect(matcher.isMatch("2026")).toBe(true);
      expect(matcher.isMatch("2026")).toBe(true);
      expect(pattern.lastIndex).toBe(0);
    });

    it("leaves the pattern's lastIndex where it found it", () => {
      const pattern = /\d/g;
      pattern.lastIndex = 3;

      expect(stringMatching(pattern).isMatch("1234")).toBe(true);
      expect(pattern.lastIndex).toBe(3);
    });

    it("does not match non-string values", () => {
      const matcher = stringMatching(/^\d+$/);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch(123)).toBe(false);
      expect(matcher.isMatch(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = stringMatching(/^hello/i);
      expect(desc(matcher)).toBe("string matching /^hello/i");
    });

    it("represents the matcher", () => {
      const matcher = stringMatching(/^hello/i);
      expect(repr(matcher)).toBe("/^hello/i");
    });
  });
});
