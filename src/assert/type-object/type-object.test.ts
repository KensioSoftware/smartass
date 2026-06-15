import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeObject } from "./type-object.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeObject } from "./type-object.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-object", () => {
  describe("assertTypeObject", () => {
    it("throws when value is not an object", () => {
      expect(() => {
        assertTypeObject("not an object");
      }).toThrow('Expected string "not an object" to be of type object.');
    });

    it("does not throw when value is an object", () => {
      expect(() => {
        assertTypeObject({});
      }).not.toThrow();
      expect(() => {
        assertTypeObject({ key: "value" });
      }).not.toThrow();
      expect(() => {
        assertTypeObject([]);
      }).not.toThrow();
      expect(() => {
        assertTypeObject(null);
      }).toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeObject(123, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-object types", () => {
      expect(() => {
        assertTypeObject(undefined);
      }).toThrow("Expected undefined to be of type object.");
      expect(() => {
        assertTypeObject(true);
      }).toThrow("Expected boolean true to be of type object.");
      expect(() => {
        assertTypeObject(123);
      }).toThrow("Expected number 123 to be of type object.");
      expect(() => {
        assertTypeObject("foobar");
      }).toThrow('Expected string "foobar" to be of type object.');
    });

    it("narrows unknown values to object", () => {
      const value: unknown = { foo: "bar" };

      assertTypeObject(value);

      expectTypeOf(value).toEqualTypeOf<object>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows primitive and object unions to object", () => {
      function getValue():
        | { foo: string }
        | string
        | number
        | boolean
        | null
        | undefined {
        return { foo: "bar" };
      }

      const value = getValue();

      assertTypeObject(value);

      expectTypeOf(value).toEqualTypeOf<{ foo: string }>();
      expectTypeOf(value).toExtend<object>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("object");
    });

    it("preserves object union overlap", () => {
      function getValue():
        | { kind: "object"; value: string }
        | { kind: "array"; value: string[] }
        | "not object"
        | null {
        return { kind: "object", value: "bar" };
      }

      const value = getValue();

      assertTypeObject(value);

      expectTypeOf(value).toEqualTypeOf<
        { kind: "object"; value: string } | { kind: "array"; value: string[] }
      >();
      expectTypeOf(value).toExtend<object>();
      expectTypeOf(value).not.toEqualTypeOf<object>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows unknown arrays to object", () => {
      const value: unknown = ["foo", "bar"];

      assertTypeObject(value);

      expectTypeOf(value).toEqualTypeOf<object>();
      expectTypeOf(value).not.toEqualTypeOf<unknown[]>();
      expect(value).toBeTypeOf("object");
      expect(Array.isArray(value)).toBe(true);
    });
  });

  describe("typeObject", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: { something: "hello" } | null };
      }

      function getFoo(): Foo {
        return { bar: { foobar: { something: "hello" } } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeObject() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an object.
      // TypeScript can then infer that foo.bar.foobar is {something: "hello"}.
      expectTypeOf(foo.bar.foobar).toExtend<object>();
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<{ something: "hello" }>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<object>();
      expect(foo.bar.foobar).toBeTypeOf("object");
    });

    it("matches object values", () => {
      const matcher = typeObject();
      expect(matcher.matches({})).toBe(true);
      expect(matcher.matches({ key: "value" })).toBe(true);
      expect(matcher.matches([])).toBe(true);
    });

    it("does not match non-object values", () => {
      const matcher = typeObject();
      expect(matcher.matches("not an object")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeObject();
      expect(desc(matcher)).toBe("object");
    });

    it("represents the matcher", () => {
      const matcher = typeObject();
      expect(repr(matcher)).toBe("Object()");
    });
  });
});
