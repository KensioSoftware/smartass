import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayEmpty } from "./array-empty.assert.js";
import type { AssertionError } from "../../assertion-error.js";
import { emptyArray } from "./array-empty.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("empty", () => {
  describe("assertArrayEmpty", () => {
    it("passes on an empty array", () => {
      expect(() => {
        assertArrayEmpty([]);
      }).not.toThrow();
    });

    it("names the elements that are present", () => {
      let error: AssertionError;
      try {
        assertArrayEmpty(["first", "second"]);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.message).toBe(
        'Expected array ["first","second"] (len 2) to be empty.',
      );
      expect(error.actual).toStrictEqual(["first", "second"]);
      expect(error.expected).toBe("[]");
    });

    it("throws on null", () => {
      expect(() => {
        assertArrayEmpty(null);
      }).toThrow("Expected null to be an empty array.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertArrayEmpty(undefined);
      }).toThrow("Expected undefined to be an empty array.");
    });

    it("throws on non-arrays", () => {
      expect(() => {
        assertArrayEmpty("abc");
      }).toThrow('Expected string "abc" to be an empty array.');
    });

    it("throws on an empty string, which is not an array", () => {
      expect(() => {
        assertArrayEmpty("");
      }).toThrow('Expected string "" to be an empty array.');
    });

    it("uses a caller-supplied message", () => {
      expect(() => {
        assertArrayEmpty(["a"], "Every statement should have been evaluated.");
      }).toThrow("Every statement should have been evaluated.");
    });

    it("preserves specific array type information when value is already an array", () => {
      const value: ("foo" | "bar")[] = [];

      assertArrayEmpty(value);

      expectTypeOf(value).toEqualTypeOf<("foo" | "bar")[] & []>();
      expectTypeOf(value).toExtend<("foo" | "bar")[]>();
      expect(value).toBeTypeOf("object");
    });

    it("preserves readonly array type information when value is already readonly", () => {
      const value: readonly ("foo" | "bar")[] = [];

      assertArrayEmpty(value);

      expectTypeOf(value).toEqualTypeOf<
        readonly ("foo" | "bar")[] & readonly []
      >();
      expectTypeOf(value).toExtend<readonly ("foo" | "bar")[]>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows unknown values to an empty array", () => {
      const value: unknown = [];

      assertArrayEmpty(value);

      expectTypeOf(value).toEqualTypeOf<[]>();
      expect(value).toBeTypeOf("object");
    });
  });

  describe("emptyArray", () => {
    it("works as composable matcher", () => {
      interface Report {
        unevaluated?: { statement: string; reason: string }[];
      }

      function getReport(): Report {
        return { unevaluated: [] };
      }

      const report = getReport();

      assertObjectMatches(report, {
        unevaluated: emptyArray(),
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows report.unevaluated is an empty array.
      expectTypeOf(report.unevaluated).toEqualTypeOf<[]>();
      expect(report.unevaluated).toStrictEqual([]);
    });

    it("matches empty arrays", () => {
      const matcher = emptyArray();

      expect(matcher.isMatch([])).toBe(true);
    });

    it("does not match arrays with elements", () => {
      const matcher = emptyArray();

      expect(matcher.isMatch([1])).toBe(false);
      expect(matcher.isMatch([1, 2, 3])).toBe(false);
    });

    it("does not match non-arrays", () => {
      const matcher = emptyArray();

      expect(matcher.isMatch(1)).toBe(false);
      expect(matcher.isMatch("")).toBe(false);
      expect(matcher.isMatch({ length: 0 })).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the emptyArray matcher", () => {
      const matcher = emptyArray();

      expect(desc(matcher)).toBe("empty array");
      expect(repr(matcher)).toBe("[]");
    });
  });

  it("uses an empty array type when the actual property is unknown", () => {
    interface Foo {
      bar?: unknown;
    }

    function getFoo(): Foo {
      return { bar: [] };
    }

    const foo = getFoo();

    assertObjectMatches(foo, {
      bar: emptyArray(),
    });

    expectTypeOf(foo.bar).toEqualTypeOf<[]>();
    expect(foo.bar).toStrictEqual([]);
  });
});
