import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectHasProperty } from "./object-has-property.assert.js";
import { objectWithProperty } from "./object-has-property.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("object-has-property", () => {
  describe("assertObjectHasProperty", () => {
    it("throws when object does not have property", () => {
      expect(() => {
        assertObjectHasProperty({ a: 1 }, "b");
      }).toThrow(
        'Expected object {"a":1} to be object with property string "b".',
      );
    });

    it("does not throw when object has property", () => {
      expect(() => {
        assertObjectHasProperty({ a: 1 }, "a");
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertObjectHasProperty({ a: 1 }, "b", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with nested objects", () => {
      const obj = { outer: { inner: "value" } };
      expect(() => {
        assertObjectHasProperty(obj, "outer");
      }).not.toThrow();

      expect(() => {
        assertObjectHasProperty(obj.outer, "inner");
      }).not.toThrow();
    });

    it("works with arrays (has length property)", () => {
      expect(() => {
        assertObjectHasProperty([1, 2, 3], "length");
      }).not.toThrow();
    });

    it("works with inherited properties", () => {
      const obj = { a: 1 };
      // Prototype property is accessible via 'toString'
      expect(() => {
        assertObjectHasProperty(obj, "toString");
      }).not.toThrow();
    });

    it("works with undefined property value", () => {
      expect(() => {
        assertObjectHasProperty({ a: undefined }, "a");
      }).not.toThrow();
    });

    it("works with empty object", () => {
      expect(() => {
        assertObjectHasProperty({}, "__proto__");
      }).not.toThrow();
    });

    it("narrows the value type to include the property", () => {
      const value: { name?: string } = { name: "Ada" };

      assertObjectHasProperty(value, "name");

      expect(value.name).toBe("Ada");
    });

    it("narrows unknown values to objects with the specified property", () => {
      const value: unknown = { name: "Ada" };

      assertObjectHasProperty(value, "name");

      expectTypeOf(value).toEqualTypeOf<object & Record<"name", unknown>>();
      expectTypeOf(value.name).toEqualTypeOf<unknown>();
      expect(value.name).toBe("Ada");
    });

    it("preserves known object types when asserting an existing optional property", () => {
      const value: { name?: string; age: number } = {
        name: "Ada",
        age: 36,
      };

      assertObjectHasProperty(value, "name");

      expectTypeOf(value).toEqualTypeOf<
        { name?: string; age: number } & object & Record<"name", unknown>
      >();
      expectTypeOf(value.name).toEqualTypeOf<string | undefined>();
      expectTypeOf(value.age).toEqualTypeOf<number>();
      expect(value.name).toBe("Ada");
      expect(value.age).toBe(36);
    });

    it("preserves known object types when asserting a new property", () => {
      const value: { age: number } = {
        age: 36,
        name: "Ada",
      } as { age: number };

      assertObjectHasProperty(value, "name");

      expectTypeOf(value).toEqualTypeOf<
        { age: number } & object & Record<"name", unknown>
      >();
      expectTypeOf(value.name).toEqualTypeOf<unknown>();
      expectTypeOf(value.age).toEqualTypeOf<number>();
      expect(value.name).toBeTypeOf("string");
      expect(value.age).toBeTypeOf("number");
    });
  });

  describe("objectWithProperty", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { something?: "hello" };
      }

      function getFoo(): Foo {
        return { bar: { something: "hello" } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: objectWithProperty("something"),
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar is an object with a property "something".
      // TypeScript then infers that `something` is a literal string "hello".
      expectTypeOf(foo.bar).toMatchObjectType<{ something: "hello" }>();
      expectTypeOf(foo.bar.something).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.something).toEqualTypeOf<"hello">();
      expect(foo.bar.something).toBe("hello");
    });

    it("matches objects with the property", () => {
      const matcher = objectWithProperty("a");

      expect(matcher.matches({ a: 1 })).toBe(true);
    });

    it("does not match objects without the property", () => {
      const matcher = objectWithProperty("b");

      expect(matcher.matches({ a: 1 })).toBe(false);
    });

    it("matches inherited properties", () => {
      const matcher = objectWithProperty("toString");

      expect(matcher.matches({ a: 1 })).toBe(true);
    });

    it("matches properties with undefined values", () => {
      const matcher = objectWithProperty("a");

      expect(matcher.matches({ a: undefined })).toBe(true);
    });

    it("matches array properties", () => {
      const matcher = objectWithProperty("length");

      expect(matcher.matches([1, 2, 3])).toBe(true);
    });

    it("matches symbol properties", () => {
      const key = Symbol("test");
      const matcher = objectWithProperty(key);

      expect(matcher.matches({ [key]: 1 })).toBe(true);
      expect(matcher.matches({})).toBe(false);
    });

    it("does not match null", () => {
      const matcher = objectWithProperty("a");

      expect(matcher.matches(null)).toBe(false);
    });

    it("does not match non-object values", () => {
      const matcher = objectWithProperty("length");

      expect(matcher.matches("abc")).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = objectWithProperty("a");

      expect(desc(matcher)).toBe('object with property string "a"');
    });

    it("represents the matcher", () => {
      const matcher = objectWithProperty("a");

      expect(repr(matcher)).toBe('{"a"}');
    });
  });
});
