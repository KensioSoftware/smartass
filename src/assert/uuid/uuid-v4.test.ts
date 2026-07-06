import { describe, expect, expectTypeOf, it } from "vitest";
import { assertUuidV4 } from "./uuid-v4.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { uuidV4 } from "./uuid-v4.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import type { UUID as NodeUuid } from "node:crypto";
import type { UuidV4 } from "./uuid-v4.type.js";

describe("uuid-v4", () => {
  describe("assertUuidV4", () => {
    it("does not throw when value is a UUID v4", () => {
      expect(() => {
        assertUuidV4("123e4567-e89b-42d3-a456-426614174000");
      }).not.toThrow();
    });

    it("does not throw when value is an uppercase UUID v4", () => {
      expect(() => {
        assertUuidV4("123E4567-E89B-42D3-A456-426614174000");
      }).not.toThrow();
    });

    it("throws when value is not a UUID", () => {
      expect(() => {
        assertUuidV4("not-a-uuid");
      }).toThrow('Expected string "not-a-uuid" to be a UUID v4 string.');
    });

    it("throws when value is a UUID but not v4", () => {
      expect(() => {
        assertUuidV4("123e4567-e89b-12d3-a456-426614174000");
      }).toThrow(
        'Expected string "123e4567-e89b-12d3-a456-426614174000" to be a UUID v4 string.',
      );
    });

    it("throws when value has an invalid variant", () => {
      expect(() => {
        assertUuidV4("123e4567-e89b-42d3-7456-426614174000");
      }).toThrow(
        'Expected string "123e4567-e89b-42d3-7456-426614174000" to be a UUID v4 string.',
      );
    });

    it("throws when value is not a string", () => {
      expect(() => {
        assertUuidV4(123);
      }).toThrow("Expected number 123 to be a UUID v4 string.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertUuidV4("not-a-uuid", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("narrows unknown values to UUID v4", () => {
      const value: unknown = "123e4567-e89b-42d3-a456-426614174000";

      assertUuidV4(value);

      expectTypeOf(value).toEqualTypeOf<UuidV4>();
      expectTypeOf(value).toExtend<NodeUuid>();
      expectTypeOf(value).toExtend<string>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
    });

    it("narrows string values to UUID v4", () => {
      function getValue(): string {
        return "123e4567-e89b-42d3-a456-426614174000";
      }

      const value = getValue();

      assertUuidV4(value);

      expectTypeOf(value).toEqualTypeOf<UuidV4>();
      expectTypeOf(value).toExtend<NodeUuid>();
      expectTypeOf(value).toExtend<string>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
    });

    it("preserves known string information when possible", () => {
      function getValue():
        "123e4567-e89b-42d3-a456-426614174000" | "not-a-uuid" {
        return "123e4567-e89b-42d3-a456-426614174000";
      }

      const value = getValue();

      assertUuidV4(value);

      expectTypeOf(value).toEqualTypeOf<
        "123e4567-e89b-42d3-a456-426614174000" & UuidV4
      >();
      expectTypeOf(value).toExtend<UuidV4>();
      expectTypeOf(value).toExtend<NodeUuid>();
      expectTypeOf(value).toExtend<string>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeTypeOf("string");
    });
  });

  describe("uuidV4", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: NodeUuid | UuidV4 | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: "878c58e7-c62c-4217-8d74-f57134093345" } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: uuidV4() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a uuidv4 string.
      expectTypeOf(foo.bar.foobar).toExtend<NodeUuid>();
      expectTypeOf(foo.bar.foobar).toExtend<string>();
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<UuidV4>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<NodeUuid>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expect(foo.bar.foobar).toBeTypeOf("string");
    });

    it("preserves UUID v4 string overlap in object matches", () => {
      interface Foo {
        bar?: {
          foobar?:
            | "123e4567-e89b-42d3-a456-426614174000"
            | "123e4567-e89b-12d3-a456-426614174000"
            | "not-a-uuid"
            | null;
        };
      }

      function getFoo(): Foo {
        return {
          bar: {
            foobar: "123e4567-e89b-42d3-a456-426614174000",
          },
        };
      }

      // Given an object property whose static type includes a UUID v4 string
      // literal and non-UUID-v4 alternatives.
      const foo = getFoo();

      // When the property is matched with the composable UUID v4 matcher.
      assertObjectMatches(foo, {
        bar: { foobar: uuidV4() },
      });

      // Then the property should keep the known UUID v4-compatible overlap
      // instead of widening to the less precise UuidV4 type.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        "123e4567-e89b-42d3-a456-426614174000" & UuidV4
      >();
      expectTypeOf(foo.bar.foobar).toExtend<UuidV4>();
      expectTypeOf(foo.bar.foobar).toExtend<NodeUuid>();
      expectTypeOf(foo.bar.foobar).toExtend<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<UuidV4>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<NodeUuid>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("string");
    });

    it("matches UUID v4 values", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123e4567-e89b-42d3-a456-426614174000")).toBe(
        true,
      );
    });

    it("matches uppercase UUID v4 values", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123E4567-E89B-42D3-A456-426614174000")).toBe(
        true,
      );
    });

    it("does not match non-UUID strings", () => {
      const matcher = uuidV4();
      expect(matcher.matches("not-a-uuid")).toBe(false);
    });

    it("does not match UUIDs that are not v4", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123e4567-e89b-12d3-a456-426614174000")).toBe(
        false,
      );
    });

    it("does not match UUIDs with invalid variant", () => {
      const matcher = uuidV4();
      expect(matcher.matches("123e4567-e89b-42d3-7456-426614174000")).toBe(
        false,
      );
    });

    it("does not match non-string values", () => {
      const matcher = uuidV4();
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = uuidV4();
      expect(desc(matcher)).toBe("UUID v4 string");
    });

    it("represents the matcher", () => {
      const matcher = uuidV4();
      expect(repr(matcher)).toBe("uuidV4()");
    });
  });
});
