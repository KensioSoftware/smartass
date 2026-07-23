import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { assertSetSize } from "./set-size.assert.js";
import { setOfSize } from "./set-size.match.js";

describe("set-size", () => {
  describe("assertSetSize", () => {
    it("throws when Set size does not match", () => {
      expect(() => {
        assertSetSize(new Set(["a", "b", "c"]), 2);
      }).toThrow(
        'Expected Set(["a","b","c"]) (size 3) to have size 2, but it had size 3.',
      );
    });

    it("does not throw when Set size matches", () => {
      expect(() => {
        assertSetSize(new Set(["a", "b", "c"]), 3);
      }).not.toThrow();
    });

    it("throws with custom message", () => {
      expect(() => {
        assertSetSize(new Set(), 1, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty Sets", () => {
      expect(() => {
        assertSetSize(new Set(), 0);
      }).not.toThrow();

      expect(() => {
        assertSetSize(new Set(), 1);
      }).toThrow(
        "Expected Set([]) (size 0) to have size 1, but it had size 0.",
      );
    });

    it("throws on null", () => {
      expect(() => {
        assertSetSize(null, 0);
      }).toThrow("Expected null to be a Set of size 0.");
    });

    it("throws on undefined", () => {
      expect(() => {
        assertSetSize(undefined, 0);
      }).toThrow("Expected undefined to be a Set of size 0.");
    });

    it("throws on non-Sets", () => {
      expect(() => {
        assertSetSize({ size: 3 }, 3);
      }).toThrow('Expected object {"size":3} to be a Set of size 3.');
    });

    it("preserves specific Set type information when value is already a Set", () => {
      const value = new Set<"foo" | "bar">(["foo", "bar"]);

      assertSetSize(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        Set<"foo" | "bar"> & {
          readonly size: 2;
        }
      >();
      expectTypeOf(value).toExtend<Set<"foo" | "bar">>();
      expectTypeOf(value.size).toEqualTypeOf<2>();
      expect(value).toBeInstanceOf(Set);
    });

    it("narrows unknown values to a Set of the expected size", () => {
      const value: unknown = new Set(["foo", "bar"]);

      assertSetSize(value, 2);

      expectTypeOf(value).toEqualTypeOf<
        Set<unknown> & {
          readonly size: 2;
        }
      >();
      expectTypeOf(value.size).toEqualTypeOf<2>();
      expect(value).toBeInstanceOf(Set);
    });
  });

  describe("setOfSize", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: Set<string> };
      }

      function getFoo(): Foo {
        return {
          bar: {
            foobar: new Set(["a", "b", "c"]),
          },
        };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: setOfSize(3) },
      });

      expectTypeOf(foo.bar.foobar).toEqualTypeOf<
        Set<string> & {
          readonly size: 3;
        }
      >();
      expectTypeOf(foo.bar.foobar.size).toEqualTypeOf<3>();
      expect(foo.bar.foobar.size).toBe(3);
    });

    it("uses unknown value type when the actual property is unknown", () => {
      interface Foo {
        bar?: unknown;
      }

      function getFoo(): Foo {
        return { bar: new Set(["a"]) };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: setOfSize(1),
      });

      expectTypeOf(foo.bar).toEqualTypeOf<
        Set<unknown> & {
          readonly size: 1;
        }
      >();
      expect(foo.bar.size).toBe(1);
    });

    it("matches Sets with the expected size", () => {
      const matcher = setOfSize(3);

      expect(matcher.isMatch(new Set(["a", "b", "c"]))).toBe(true);
    });

    it("does not match Sets with a different size", () => {
      const matcher = setOfSize(3);

      expect(matcher.isMatch(new Set(["a"]))).toBe(false);
      expect(matcher.isMatch(new Set(["a", "b", "c", "d"]))).toBe(false);
    });

    it("matches empty Sets when expected size is zero", () => {
      const matcher = setOfSize(0);

      expect(matcher.isMatch(new Set())).toBe(true);
      expect(matcher.isMatch(new Set(["a"]))).toBe(false);
    });

    it("does not match non-Sets", () => {
      const matcher = setOfSize(1);

      expect(matcher.isMatch(1)).toBe(false);
      expect(matcher.isMatch("a")).toBe(false);
      expect(matcher.isMatch({ size: 1 })).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the setOfSize matcher", () => {
      const matcher = setOfSize(3);

      expect(desc(matcher)).toBe("Set of size 3");
      expect(repr(matcher)).toBe("Set(3)");
    });
  });
});
