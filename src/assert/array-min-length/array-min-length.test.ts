import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayMinLength } from "./array-min-length.assert.js";
import { arrayOfMinLength } from "./array-min-length.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("array-min-length", () => {
  describe("assertArrayMinLength", () => {
    it("throws when array is shorter than minimum length", () => {
      expect(() => {
        assertArrayMinLength([1, 2], 3);
      }).toThrow(
        "Expected array [1,2] (len 2) to have at least 3 elements, but it had 2.",
      );
    });

    it("does not throw when array has exactly the minimum length", () => {
      expect(() => {
        assertArrayMinLength([1, 2, 3], 3);
      }).not.toThrow();
    });

    it("does not throw when array exceeds the minimum length", () => {
      expect(() => {
        assertArrayMinLength([1, 2, 3, 4, 5], 3);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertArrayMinLength([1], 5, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty arrays and minimum 0", () => {
      expect(() => {
        assertArrayMinLength([], 0);
      }).not.toThrow();
      expect(() => {
        assertArrayMinLength([], 1);
      }).toThrow(
        "Expected array [] (len 0) to have at least 1 elements, but it had 0.",
      );
    });

    it("throws on null", () => {
      expect(() => {
        assertArrayMinLength(null, 1);
      }).toThrow("Expected null to be an array of at least 1 elements.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertArrayMinLength(undefined, 1);
      }).toThrow("Expected undefined to be an array of at least 1 elements.");
    });

    it("throws on non-arrays", () => {
      expect(() => {
        assertArrayMinLength("abc", 3);
      }).toThrow(
        'Expected string "abc" to be an array of at least 3 elements.',
      );
    });

    it("works with different minimum lengths", () => {
      expect(() => {
        assertArrayMinLength([1], 1);
      }).not.toThrow();
      expect(() => {
        assertArrayMinLength([1, 2], 2);
      }).not.toThrow();
      expect(() => {
        assertArrayMinLength([1, 2, 3, 4, 5], 5);
      }).not.toThrow();
      expect(() => {
        assertArrayMinLength([1, 2, 3, 4, 5, 6], 6);
      }).not.toThrow();
      expect(() => {
        assertArrayMinLength([1, 2, 3, 4, 5, 6], 3);
      }).not.toThrow();
    });

    it("preserves specific array type information when value is already an array", () => {
      const value: ("foo" | "bar")[] = ["foo", "bar"];

      assertArrayMinLength(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        ("foo" | "bar")[] & ["foo" | "bar", "foo" | "bar", ...("foo" | "bar")[]]
      >();
      expectTypeOf(value).toExtend<("foo" | "bar")[]>();
      expectTypeOf(value).toExtend<
        ["foo" | "bar", "foo" | "bar", ...("foo" | "bar")[]]
      >();
      expect(value).toBeTypeOf("object");
    });

    it("preserves readonly array type information when value is already readonly", () => {
      const value: readonly ("foo" | "bar")[] = ["foo", "bar"];

      assertArrayMinLength(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        readonly ("foo" | "bar")[] &
          readonly ["foo" | "bar", "foo" | "bar", ...("foo" | "bar")[]]
      >();
      expectTypeOf(value).toExtend<readonly ("foo" | "bar")[]>();
      expectTypeOf(value).toExtend<
        readonly ["foo" | "bar", "foo" | "bar", ...("foo" | "bar")[]]
      >();
      expect(value).toBeTypeOf("object");
    });

    it("narrows optional arrays to exclude undefined", () => {
      interface Foo {
        readonly foobar?: string[] | undefined;
      }

      function getFoo(): Foo {
        return { foobar: ["foo", "bar"] };
      }

      const foo = getFoo();

      assertArrayMinLength(foo.foobar, 1);

      expectTypeOf(foo.foobar).toEqualTypeOf<
        string[] & [string, ...string[]]
      >();
      expectTypeOf(foo.foobar[0]).toEqualTypeOf<string>();
      expectTypeOf(foo.foobar[1]).toEqualTypeOf<string | undefined>();
      expect(foo.foobar[0]).toBe("foo");
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

      assertArrayMinLength(output.HostedZones, 2);

      expectTypeOf(output.HostedZones).toEqualTypeOf<
        readonly HostedZone[] &
          readonly [HostedZone, HostedZone, ...HostedZone[]]
      >();
      expectTypeOf(output.HostedZones).toExtend<readonly HostedZone[]>();
      expectTypeOf(output.HostedZones[0]).toEqualTypeOf<HostedZone>();
      expectTypeOf(output.HostedZones[1]).toEqualTypeOf<HostedZone>();
      expectTypeOf(output.HostedZones[2]).toEqualTypeOf<
        HostedZone | undefined
      >();
      expectTypeOf(output.HostedZones[0].Name).toEqualTypeOf<
        string | undefined
      >();
      expect(output.HostedZones[0].Name).toBe("a.example.com.");
    });

    it("does not narrow readonly array elements to never", () => {
      interface ReadonlyItem {
        readonly id: string;
        readonly enabled: boolean;
      }

      interface ReadonlyContainer {
        readonly items: readonly ReadonlyItem[];
      }

      const container: ReadonlyContainer = {
        items: [
          { id: "first", enabled: true },
          { id: "second", enabled: false },
        ],
      };

      assertArrayMinLength(container.items, 2);

      expectTypeOf(container.items).toEqualTypeOf<
        readonly ReadonlyItem[] &
          readonly [ReadonlyItem, ReadonlyItem, ...ReadonlyItem[]]
      >();
      expectTypeOf(container.items[0]).toEqualTypeOf<ReadonlyItem>();
      expectTypeOf(container.items[1]).toEqualTypeOf<ReadonlyItem>();
      expectTypeOf(container.items[1].id).toEqualTypeOf<string>();
      expectTypeOf(container.items[0].enabled).toEqualTypeOf<boolean>();
      expectTypeOf(container.items[1].enabled).toEqualTypeOf<boolean>();

      expect(container.items[1].id).toBe("second");
      expect(container.items[0].enabled).toBe(true);
      expect(container.items[1].enabled).toBe(false);
    });

    it("narrows unknown values to an array with at least the expected length", () => {
      const value: unknown = ["foo", "bar"];

      assertArrayMinLength(value, 2);

      expectTypeOf(value).toEqualTypeOf<[unknown, unknown, ...unknown[]]>();
      expectTypeOf(value).toExtend<unknown[]>();
      expect(value).toBeTypeOf("object");
    });
  });

  describe("arrayOfMinLength", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: arrayOfMinLength(2) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is an array of at least 2 strings.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        [string, string, ...string[]]
      >();
      expectTypeOf(foo.bar.foobar[0]).toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar[1]).toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar[2]).toEqualTypeOf<string | undefined>();
      expect(foo.bar.foobar[0]).toBeTypeOf("string");
      expect(foo.bar.foobar[1]).toBeTypeOf("string");
      expect(["string", "undefined"]).toContain(typeof foo.bar.foobar[2]);
    });

    it("does not narrow readonly array elements to never when used as a matcher", () => {
      interface ReadonlyItem {
        readonly id: string;
        readonly enabled: boolean;
      }

      interface ReadonlyContainer {
        readonly items: readonly ReadonlyItem[];
      }

      const container: ReadonlyContainer = {
        items: [
          { id: "first", enabled: true },
          { id: "second", enabled: false },
        ],
      };

      assertObjectMatches(container, {
        items: arrayOfMinLength(2),
      });

      expectTypeOf(container.items).toEqualTypeOf<
        readonly [ReadonlyItem, ReadonlyItem, ...ReadonlyItem[]]
      >();
      expectTypeOf(container.items[0]).toEqualTypeOf<ReadonlyItem>();
      expectTypeOf(container.items[1]).toEqualTypeOf<ReadonlyItem>();
      expectTypeOf(container.items[1].id).toEqualTypeOf<string>();
      expectTypeOf(container.items[0].enabled).toEqualTypeOf<boolean>();
      expectTypeOf(container.items[1].enabled).toEqualTypeOf<boolean>();

      expect(container.items[1].id).toBe("second");
      expect(container.items[0].enabled).toBe(true);
      expect(container.items[1].enabled).toBe(false);
    });

    it("matches arrays with exactly the minimum length", () => {
      const matcher = arrayOfMinLength(3);

      expect(matcher.matches([1, 2, 3])).toBe(true);
    });

    it("matches arrays longer than the minimum length", () => {
      const matcher = arrayOfMinLength(3);

      expect(matcher.matches([1, 2, 3, 4])).toBe(true);
    });

    it("does not match arrays shorter than the minimum length", () => {
      const matcher = arrayOfMinLength(3);

      expect(matcher.matches([1, 2])).toBe(false);
    });

    it("matches any array when minimum length is zero", () => {
      const matcher = arrayOfMinLength(0);

      expect(matcher.matches([])).toBe(true);
      expect(matcher.matches([1, 2, 3])).toBe(true);
    });

    it("does not match non-arrays", () => {
      const matcher = arrayOfMinLength(1);

      expect(matcher.matches(1)).toBe(false);
      expect(matcher.matches("a")).toBe(false);
      expect(matcher.matches({ 0: "a", length: 1 })).toBe(false);
      expect(matcher.matches(null)).toBe(false);
    });

    it("describes the arrayOfMinLength matcher", () => {
      const matcher = arrayOfMinLength(3);

      expect(desc(matcher)).toBe("array of at least 3 elements");
      expect(repr(matcher)).toBe("Array(>=3)");
    });
  });

  it("uses unknown element type when the actual property is unknown", () => {
    interface Foo {
      bar?: unknown;
    }

    function getFoo(): Foo {
      return { bar: ["a", "b", "c"] };
    }

    const foo = getFoo();

    assertObjectMatches(foo, {
      bar: arrayOfMinLength(2),
    });

    expectTypeOf(foo.bar).toEqualTypeOf<[unknown, unknown, ...unknown[]]>();
    expectTypeOf(foo.bar[0]).toEqualTypeOf<unknown>();
    expectTypeOf(foo.bar[1]).toEqualTypeOf<unknown>();
    expectTypeOf(foo.bar[2]).toEqualTypeOf<unknown>();
    expect(foo.bar).toHaveLength(3);
  });

  it("describes the arrayOfMinLength matcher", () => {
    const matcher = arrayOfMinLength(3);

    expect(desc(matcher)).toBe("array of at least 3 elements");
    expect(repr(matcher)).toBe("Array(>=3)");
  });
});
