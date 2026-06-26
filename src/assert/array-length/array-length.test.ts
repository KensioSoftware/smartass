import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayLength } from "./array-length.assert.js";
import { arrayOfLength } from "./array-length.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("array-length", () => {
  describe("assertArrayLength", () => {
    it("throws when array length does not match", () => {
      expect(() => {
        assertArrayLength([1, 2, 3], 2);
      }).toThrow(
        "Expected array [1,2,3] (len 3) to have length 2, but it had length 3.",
      );
    });

    it("does not throw when array length matches", () => {
      expect(() => {
        assertArrayLength([1, 2, 3], 3);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertArrayLength([], 1, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty arrays", () => {
      expect(() => {
        assertArrayLength([], 0);
      }).not.toThrow();
      expect(() => {
        assertArrayLength([], 1);
      }).toThrow(
        "Expected array [] (len 0) to have length 1, but it had length 0.",
      );
    });

    it("throws on null", () => {
      expect(() => {
        assertArrayLength(null, 0);
      }).toThrow("Expected null to be an array of length 0.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertArrayLength(undefined, 0);
      }).toThrow("Expected undefined to be an array of length 0.");
    });

    it("throws on non-arrays", () => {
      expect(() => {
        assertArrayLength("abc", 3);
      }).toThrow('Expected string "abc" to be an array of length 3.');
    });

    it("works with different lengths", () => {
      expect(() => {
        assertArrayLength([1], 1);
      }).not.toThrow();
      expect(() => {
        assertArrayLength([1, 2], 2);
      }).not.toThrow();
      expect(() => {
        assertArrayLength([1, 2, 3, 4, 5], 5);
      }).not.toThrow();
      expect(() => {
        assertArrayLength([1, 2, 3, 4, 5, 6], 6);
      }).not.toThrow();
    });

    it("preserves specific array type information when value is already an array", () => {
      const value: ("foo" | "bar")[] = ["foo", "bar"];

      assertArrayLength(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        ("foo" | "bar")[] & ["foo" | "bar", "foo" | "bar"]
      >();
      expectTypeOf(value).toExtend<("foo" | "bar")[]>();
      expectTypeOf(value).toExtend<["foo" | "bar", "foo" | "bar"]>();
      expect(value).toBeTypeOf("object");
    });

    it("preserves readonly array type information when value is already readonly", () => {
      const value: readonly ("foo" | "bar")[] = ["foo", "bar"];

      assertArrayLength(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        readonly ("foo" | "bar")[] & readonly ["foo" | "bar", "foo" | "bar"]
      >();
      expectTypeOf(value).toExtend<readonly ("foo" | "bar")[]>();
      expectTypeOf(value).toExtend<readonly ["foo" | "bar", "foo" | "bar"]>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows unknown values to an array of the expected length", () => {
      const value: unknown = ["foo", "bar"];

      assertArrayLength(value, 2);

      expectTypeOf(value).toEqualTypeOf<[unknown, unknown]>();
      expectTypeOf(value).toExtend<unknown[]>();
      expect(value).toBeTypeOf("object");
    });

    it("narrows to exclude optional undefined", () => {
      interface Foo {
        foobar?: string[] | undefined;
      }

      function getFoo(): Foo {
        return { foobar: ["foo"] };
      }

      const foo = getFoo();

      assertArrayLength(foo.foobar, 1);

      expectTypeOf(foo.foobar).toExtend<string[]>();
      expectTypeOf(foo.foobar).toEqualTypeOf<string[] & [string]>();
      expect(foo.foobar).toBeTypeOf("object");

      expectTypeOf(foo.foobar[0]).toEqualTypeOf<string>();
      expectTypeOf(foo.foobar[0]).not.toEqualTypeOf<undefined>();
    });

    it("narrows readonly optional arrays while preserving element type", () => {
      interface HostedZone {
        readonly Id?: string | undefined;
        readonly Name?: string | undefined;
      }

      interface ListHostedZonesOutput {
        readonly HostedZones?: readonly HostedZone[] | undefined;
      }

      function getOutput(): ListHostedZonesOutput {
        return {
          HostedZones: [
            { Name: "a.example.com." },
            { Name: "b.example.com." },
            { Name: "c.example.com." },
          ],
        };
      }

      const output = getOutput();

      assertArrayLength(output.HostedZones, 3);

      expectTypeOf(output.HostedZones).toExtend<readonly HostedZone[]>();
      expectTypeOf(output.HostedZones[0]).toEqualTypeOf<HostedZone>();
      expectTypeOf(output.HostedZones[0].Name).toEqualTypeOf<
        string | undefined
      >();
      expect(output.HostedZones[0].Name).toBe("a.example.com.");
    });
  });

  describe("arrayOfLength", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: arrayOfLength(3) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an array of 3 strings.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<[string, string, string]>();
      expectTypeOf(foo.bar.foobar[0]).toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar[1]).toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar[2]).toEqualTypeOf<string>();
      // @ts-expect-error Tuple type has no element at index 3.
      expectTypeOf(foo.bar.foobar[3]).toEqualTypeOf<undefined>();
      expect(foo.bar.foobar[0]).toBeTypeOf("string");
      expect(foo.bar.foobar[1]).toBeTypeOf("string");
      expect(foo.bar.foobar[2]).toBeTypeOf("string");
      // @ts-expect-error Tuple type has no element at index 3.
      expect(foo.bar.foobar[3]).toBeUndefined();
    });

    it("uses unknown element type when the actual property is unknown", () => {
      interface Foo {
        bar?: unknown;
      }

      function getFoo(): Foo {
        return { bar: ["a", "b"] };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: arrayOfLength(2),
      });

      expectTypeOf(foo.bar).toEqualTypeOf<[unknown, unknown]>();
      expect(foo.bar).toHaveLength(2);
    });

    it("matches arrays with the expected length", () => {
      const matcher = arrayOfLength(3);

      expect(matcher.matches([1, 2, 3])).toBe(true);
    });

    it("does not match arrays with a different length", () => {
      const matcher = arrayOfLength(3);

      expect(matcher.matches([1, 2])).toBe(false);
      expect(matcher.matches([1, 2, 3, 4])).toBe(false);
    });

    it("matches empty arrays when expected length is zero", () => {
      const matcher = arrayOfLength(0);

      expect(matcher.matches([])).toBe(true);
      expect(matcher.matches([1])).toBe(false);
    });

    it("does not match non-arrays", () => {
      const matcher = arrayOfLength(1);

      expect(matcher.matches(1)).toBe(false);
      expect(matcher.matches("a")).toBe(false);
      expect(matcher.matches({ 0: "a", length: 1 })).toBe(false);
      expect(matcher.matches(null)).toBe(false);
    });

    it("describes the arrayOfLength matcher", () => {
      const matcher = arrayOfLength(3);

      expect(desc(matcher)).toBe("array of length 3");
      expect(repr(matcher)).toBe("Array(3)");
    });
  });
});
