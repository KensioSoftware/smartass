import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeFunction } from "./type-function.assert.js";
import { desc, repr } from "../../describe/describe.js";
import { typeFunction } from "./type-function.match.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("type-function", () => {
  describe("assertTypeFunction", () => {
    it("throws when value is not a function", () => {
      expect(() => {
        assertTypeFunction("foobar");
      }).toThrow('Expected string "foobar" to be of type function.');
    });

    it("does not throw when value is a function", () => {
      expect(() => {
        assertTypeFunction(() => {
          /* empty */
        });
      }).not.toThrow();
      expect(() => {
        assertTypeFunction(function () {
          /* empty */
        });
      }).not.toThrow();
      expect(() => {
        assertTypeFunction(async () => {
          /* empty */
        });
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeFunction(123, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with various non-function types", () => {
      expect(() => {
        assertTypeFunction(null);
      }).toThrow("Expected null to be of type function.");
      expect(() => {
        assertTypeFunction(undefined);
      }).toThrow("Expected undefined to be of type function.");
      expect(() => {
        assertTypeFunction(true);
      }).toThrow("Expected boolean true to be of type function.");
      expect(() => {
        assertTypeFunction(123);
      }).toThrow("Expected number 123 to be of type function.");
      expect(() => {
        assertTypeFunction({});
      }).toThrow("Expected object {} to be of type function.");
    });

    it("narrows unknown values to Function", () => {
      const value: unknown = () => 42;

      assertTypeFunction(value);

      expectTypeOf(value).toEqualTypeOf<Function>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expect(value).toBeTypeOf("function");
    });

    it("narrows primitive and function unions to Function", () => {
      function getValue():
        string | number | boolean | null | undefined | Function {
        return () => 42;
      }

      const value = getValue();

      assertTypeFunction(value);

      expectTypeOf(value).toEqualTypeOf<Function>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expectTypeOf(value).not.toEqualTypeOf<number>();
      expectTypeOf(value).not.toEqualTypeOf<boolean>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expectTypeOf(value).not.toEqualTypeOf<undefined>();
      expect(value).toBeTypeOf("function");
    });

    it("preserves specific function-type overlap", () => {
      type StringFactory = () => string;
      type NumberFactory = () => number;

      function getValue(): StringFactory | NumberFactory | "not function" {
        return () => "hello";
      }

      const value = getValue();

      assertTypeFunction(value);

      expectTypeOf(value).toEqualTypeOf<StringFactory | NumberFactory>();

      expectTypeOf(value).toExtend<Function>();

      expectTypeOf(value).not.toEqualTypeOf<Function>();
      expect(value).toBeTypeOf("function");
    });
  });

  describe("typeFunction", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: Function | null };
      }

      function getFoo(): Foo {
        return {
          bar: {
            foobar: () => 42,
          },
        };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeFunction() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a function.

      expectTypeOf(foo.bar.foobar).toEqualTypeOf<Function>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("function");
    });

    it("preserves specific function-type overlap in object matches", () => {
      type StringFactory = () => string;
      type NumberFactory = () => number;

      interface Foo {
        bar?: {
          foobar?: StringFactory | NumberFactory | "not function" | null;
        };
      }

      function getFoo(): Foo {
        return {
          bar: {
            foobar: () => "hello",
          },
        };
      }

      // Given an object property whose static type includes specific function
      // signatures plus non-function alternatives.
      const foo = getFoo();

      // When the property is matched with the composable function matcher.
      assertObjectMatches(foo, {
        bar: { foobar: typeFunction() },
      });

      // Then the property should keep the known function signatures instead
      // of widening to the less useful Function type.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        StringFactory | NumberFactory
      >();
      expectTypeOf(foo.bar.foobar).toExtend<Function>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<Function>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<"not function">();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("function");
    });

    it("matches function values", () => {
      const matcher = typeFunction();
      expect(
        matcher.isMatch(() => {
          //
        }),
      ).toBe(true);
      expect(
        matcher.isMatch(function () {
          //
        }),
      ).toBe(true);
      expect(
        matcher.isMatch(async () => {
          //
        }),
      ).toBe(true);
    });

    it("does not match non-function values", () => {
      const matcher = typeFunction();
      expect(matcher.isMatch("foobar")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
      expect(matcher.isMatch(true)).toBe(false);
      expect(matcher.isMatch(123)).toBe(false);
      expect(matcher.isMatch({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeFunction();
      expect(desc(matcher)).toBe("function");
    });

    it("represents the matcher", () => {
      const matcher = typeFunction();
      expect(repr(matcher)).toBe("Function()");
    });
  });
});
