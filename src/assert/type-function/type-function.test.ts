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
  });

  describe("typeFunction", () => {
    it("works as composable matcher", () => {
      interface Foo {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<Function>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeTypeOf("function");
    });

    it("matches function values", () => {
      const matcher = typeFunction();
      expect(
        matcher.matches(() => {
          //
        }),
      ).toBe(true);
      expect(
        matcher.matches(function () {
          //
        }),
      ).toBe(true);
      expect(
        matcher.matches(async () => {
          //
        }),
      ).toBe(true);
    });

    it("does not match non-function values", () => {
      const matcher = typeFunction();
      expect(matcher.matches("foobar")).toBe(false);
      expect(matcher.matches(null)).toBe(false);
      expect(matcher.matches(undefined)).toBe(false);
      expect(matcher.matches(true)).toBe(false);
      expect(matcher.matches(123)).toBe(false);
      expect(matcher.matches({})).toBe(false);
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
