import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { assertMapSize } from "./map-size.assert.js";
import { mapOfSize } from "./map-size.match.js";

describe("map-size", () => {
  describe("assertMapSize", () => {
    it("throws when Map size does not match", () => {
      expect(() => {
        assertMapSize(
          new Map<string, number>([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ]),
          2,
        );
      }).toThrow(
        'Expected Map([["a",1],["b",2],["c",3]]) (size 3) to have size 2, but it had size 3.',
      );
    });

    it("does not throw when Map size matches", () => {
      expect(() => {
        assertMapSize(
          new Map<string, number>([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ]),
          3,
        );
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertMapSize(new Map(), 1, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty Maps", () => {
      expect(() => {
        assertMapSize(new Map(), 0);
      }).not.toThrow();
      expect(() => {
        assertMapSize(new Map(), 1);
      }).toThrow(
        "Expected Map([]) (size 0) to have size 1, but it had size 0.",
      );
    });

    it("throws on null", () => {
      expect(() => {
        assertMapSize(null, 0);
      }).toThrow("Expected null to be a Map of size 0.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertMapSize(undefined, 0);
      }).toThrow("Expected undefined to be a Map of size 0.");
    });

    it("throws on non-Maps", () => {
      expect(() => {
        assertMapSize({ size: 3 }, 3);
      }).toThrow('Expected object {"size":3} to be a Map of size 3.');
    });

    it("preserves specific Map type information when value is already a Map", () => {
      const value = new Map<"foo" | "bar", number>([
        ["foo", 1],
        ["bar", 2],
      ]);

      assertMapSize(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        Map<"foo" | "bar", number> & {
          readonly size: 2;
        }
      >();
      expectTypeOf(value).toExtend<Map<"foo" | "bar", number>>();
      expectTypeOf(value.size).toEqualTypeOf<2>();
      expect(value).toBeInstanceOf(Map);
    });

    it("narrows unknown values to a Map of the expected size", () => {
      const value: unknown = new Map([
        ["foo", 1],
        ["bar", 2],
      ]);

      assertMapSize(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        Map<unknown, unknown> & {
          readonly size: 2;
        }
      >();
      expectTypeOf(value.size).toEqualTypeOf<2>();
      expect(value).toBeInstanceOf(Map);
    });
  });

  describe("mapOfSize", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: Map<string, number> };
      }

      function getFoo(): Foo {
        return {
          bar: {
            foobar: new Map([
              ["a", 1],
              ["b", 2],
              ["c", 3],
            ]),
          },
        };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: mapOfSize(3) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a Map of size 3.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        Map<string, number> & {
          readonly size: 3;
        }
      >();
      expectTypeOf(foo.bar.foobar.size).toEqualTypeOf<3>();
      expect(foo.bar.foobar.size).toBe(3);
    });

    it("uses unknown key and value types when the actual property is unknown", () => {
      interface Foo {
        bar?: unknown;
      }

      function getFoo(): Foo {
        return { bar: new Map([["a", 1]]) };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: mapOfSize(1),
      });

      expectTypeOf(foo.bar).toEqualTypeOf<
        Map<unknown, unknown> & {
          readonly size: 1;
        }
      >();
      expect(foo.bar.size).toBe(1);
    });

    it("matches Maps with the expected size", () => {
      const matcher = mapOfSize(3);

      expect(
        matcher.isMatch(
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ]),
        ),
      ).toBe(true);
    });

    it("does not match Maps with a different size", () => {
      const matcher = mapOfSize(3);

      expect(matcher.isMatch(new Map([["a", 1]]))).toBe(false);
      expect(
        matcher.isMatch(
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
          ]),
        ),
      ).toBe(false);
    });

    it("matches empty Maps when expected size is zero", () => {
      const matcher = mapOfSize(0);

      expect(matcher.isMatch(new Map())).toBe(true);
      expect(matcher.isMatch(new Map([["a", 1]]))).toBe(false);
    });

    it("does not match non-Maps", () => {
      const matcher = mapOfSize(1);

      expect(matcher.isMatch(1)).toBe(false);
      expect(matcher.isMatch("a")).toBe(false);
      expect(matcher.isMatch({ size: 1 })).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the mapOfSize matcher", () => {
      const matcher = mapOfSize(3);

      expect(desc(matcher)).toBe("Map of size 3");
      expect(repr(matcher)).toBe("Map(3)");
    });
  });
});
