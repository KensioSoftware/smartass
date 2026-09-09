import { describe, expect, expectTypeOf, it } from "vitest";
import { assertStringNotEmpty } from "./string-not-empty.assert.js";
import type { AssertionError } from "../../assertion-error.js";
import { nonEmptyString } from "./string-not-empty.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("string-not-empty", () => {
  describe("assertStringNotEmpty", () => {
    it("does not throw when the string has a character", () => {
      expect(() => {
        assertStringNotEmpty("a");
      }).not.toThrow();
    });

    it("throws on the empty string", () => {
      let error: AssertionError;
      try {
        assertStringNotEmpty("");
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.message).toBe(
        "Expected string not to be empty, but it was empty.",
      );
      expect(error.actual).toBe("");
      expect(error.expected).toBe('"…"');
    });

    it("throws with a custom message", () => {
      expect(() => {
        assertStringNotEmpty("", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("throws on null", () => {
      expect(() => {
        assertStringNotEmpty(null);
      }).toThrow("Expected null to be a non-empty string.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertStringNotEmpty(undefined);
      }).toThrow("Expected undefined to be a non-empty string.");
    });

    it("throws on non-strings", () => {
      expect(() => {
        assertStringNotEmpty(["abc"]);
      }).toThrow('Expected array ["abc"] (len 1) to be a non-empty string.');

      expect(() => {
        assertStringNotEmpty(0);
      }).toThrow("Expected number 0 to be a non-empty string.");
    });

    it("counts whitespace as a character", () => {
      expect(() => {
        assertStringNotEmpty(" ");
      }).not.toThrow();
    });

    it("narrows unknown values to a non-empty string", () => {
      const value: unknown = "admin";

      assertStringNotEmpty(value);

      expectTypeOf(value).toEqualTypeOf<string & { 0: string }>();
      expectTypeOf(value).toExtend<string>();
      // Indexing the first character is safe under noUncheckedIndexedAccess.
      expectTypeOf(value[0]).toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
    });

    it("drops the empty string from a literal union", () => {
      const value: "" | "draft" = "draft";

      assertStringNotEmpty(value);

      expectTypeOf(value).toEqualTypeOf<"draft" & { 0: string }>();
      expectTypeOf(value).toExtend<"draft">();
      expect(value).toBe("draft");
    });

    it("keeps a known string type when there is nothing to drop", () => {
      const value = "admin" as string;

      assertStringNotEmpty(value);

      expectTypeOf(value).toEqualTypeOf<string & { 0: string }>();
      expect(value[0]).toBe("a");
    });
  });

  describe("nonEmptyString", () => {
    it("works as composable matcher", () => {
      interface Record_ {
        record?: { sequenceNumber?: string };
      }

      function getRecord(): Record_ {
        return { record: { sequenceNumber: "49590338271490256608559692538" } };
      }

      const found = getRecord();

      assertObjectMatches(found, {
        record: { sequenceNumber: nonEmptyString() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows found.record.sequenceNumber is a string with a
      // character in it.
      expectTypeOf(found.record.sequenceNumber).toEqualTypeOf<
        string & { 0: string }
      >();
      expectTypeOf(found.record.sequenceNumber[0]).toEqualTypeOf<string>();
      expect(found.record.sequenceNumber[0]).toBe("4");
    });

    it("matches non-empty strings", () => {
      const matcher = nonEmptyString();

      expect(matcher.isMatch("a")).toBe(true);
      expect(matcher.isMatch("draft")).toBe(true);
    });

    it("does not match the empty string", () => {
      const matcher = nonEmptyString();

      expect(matcher.isMatch("")).toBe(false);
    });

    it("does not match non-strings", () => {
      const matcher = nonEmptyString();

      expect(matcher.isMatch(1)).toBe(false);
      expect(matcher.isMatch(["a"])).toBe(false);
      expect(matcher.isMatch({ 0: "a", length: 1 })).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the nonEmptyString matcher", () => {
      const matcher = nonEmptyString();

      expect(desc(matcher)).toBe("non-empty string");
      expect(repr(matcher)).toBe('"…"');
    });
  });
});
