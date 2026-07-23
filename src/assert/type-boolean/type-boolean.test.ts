import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeBoolean } from "./type-boolean.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeBoolean } from "./type-boolean.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-boolean", () => {
  describe("assertTypeBoolean", () => {
    it("throws when value is not a boolean", () => {
      expect(() => {
        assertTypeBoolean("true");
      }).toThrow('Expected string "true" to be of type boolean.');
    });

    it("does not throw when value is a boolean", () => {
      expect(() => {
        assertTypeBoolean(true);
      }).not.toThrow();
      expect(() => {
        assertTypeBoolean(false);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeBoolean(1, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-boolean types", () => {
      expect(() => {
        assertTypeBoolean(null);
      }).toThrow("Expected null to be of type boolean.");
      expect(() => {
        assertTypeBoolean(undefined);
      }).toThrow("Expected undefined to be of type boolean.");
      expect(() => {
        assertTypeBoolean(1);
      }).toThrow("Expected number 1 to be of type boolean.");
      expect(() => {
        assertTypeBoolean({});
      }).toThrow("Expected object {} to be of type boolean.");
    });

    it("narrows unknown values to boolean", () => {
      const value: unknown = true;

      assertTypeBoolean(value);

      expectTypeOf(value).toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expect(value).toBeTypeOf("boolean");
    });

    it("narrows primitive unions to boolean", () => {
      // eslint-disable-next-line unicorn/consistent-boolean-name
      function getValue():
        string | number | boolean | bigint | null | undefined {
        return true;
      }

      const isValue = getValue();

      assertTypeBoolean(isValue);

      expectTypeOf(isValue).toEqualTypeOf<boolean>();
      expectTypeOf(isValue).not.toEqualTypeOf<string>();
      expectTypeOf(isValue).not.toEqualTypeOf<number>();
      expectTypeOf(isValue).not.toEqualTypeOf<bigint>();
      expectTypeOf(isValue).not.toEqualTypeOf<null>();
      expectTypeOf(isValue).not.toEqualTypeOf<undefined>();
      expect(isValue).toBeTypeOf("boolean");
    });

    it("preserves boolean literal union overlap", () => {
      // eslint-disable-next-line unicorn/consistent-boolean-name
      function getValue(): true | false | "not boolean" {
        return true;
      }

      const isValue = getValue();

      assertTypeBoolean(isValue);

      expectTypeOf(isValue).toEqualTypeOf<true | false>();
      expectTypeOf(isValue).toEqualTypeOf<boolean>();
      expectTypeOf(isValue).not.toEqualTypeOf<true>();
      expectTypeOf(isValue).not.toEqualTypeOf<false>();
      expect(isValue).toBeTypeOf("boolean");
    });
  });

  describe("typeBoolean", () => {
    it("preserves boolean literal overlap in object matches", () => {
      interface Foo {
        bar?: {
          enabled?: true | "disabled" | null;
        };
      }

      function getFoo(): Foo {
        return { bar: { enabled: true } };
      }

      // Given an object property whose static type includes one boolean
      // literal and several non-boolean alternatives.
      const foo = getFoo();

      // When the property is matched with the composable boolean matcher.
      assertObjectMatches(foo, {
        bar: { enabled: typeBoolean() },
      });

      // Then the property should narrow to the existing boolean literal
      // overlap, rather than widening to boolean.
      expectTypeOf(foo.bar.enabled).toEqualTypeOf<true>();
      expectTypeOf(foo.bar.enabled).toExtend<boolean>();
      expectTypeOf(foo.bar.enabled).not.toEqualTypeOf<boolean>();
      expectTypeOf(foo.bar.enabled).not.toEqualTypeOf<"disabled">();
      expectTypeOf(foo.bar.enabled).not.toEqualTypeOf<null>();
      expect(foo.bar.enabled).toBeTypeOf("boolean");
    });

    it("matches boolean values", () => {
      const matcher = typeBoolean();
      expect(matcher.isMatch(true)).toBe(true);
      expect(matcher.isMatch(false)).toBe(true);
    });

    it("does not match non-boolean values", () => {
      const matcher = typeBoolean();
      expect(matcher.isMatch("true")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch(1)).toBe(false);
      expect(matcher.isMatch({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeBoolean();
      expect(desc(matcher)).toBe("boolean");
    });

    it("represents the matcher", () => {
      const matcher = typeBoolean();
      expect(repr(matcher)).toBe("Boolean()");
    });
  });
});
